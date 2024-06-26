import axios, { AxiosError } from 'axios';
import { StatusCodes } from 'http-status-codes';
import { UserIDJwtPayload, sign, verify } from 'jsonwebtoken';
import { User, Wallet } from 'knex';
import pino from 'pino';
import UserDao from '../../dao/user';
import { comparePassword, hashPassword } from '../../lib/bcrypt';
import { ServiceResponse } from '../core/types';
import { LoginDto, RegisterDto } from './auth.validation';

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};

export default class AuthService {
  private readonly userDao: UserDao;

  constructor() {
    this.userDao = new UserDao();
  }

  async getProfile(userId: string): Promise<ServiceResponse<User>> {
    const user = await this.userDao.findById(userId);
    if (!user)
      return {
        status: StatusCodes.NOT_FOUND,
        message: 'User not found',
      };

    // Remove sensitive information from return data
    delete (user as Partial<User>).password;

    return {
      message: 'User profile fetched successfully',
      data: user,
    };
  }

  async register(
    dto: RegisterDto,
    logger: pino.Logger
  ): Promise<ServiceResponse<{ user: User; wallet: Wallet } & AuthTokens>> {
    const emailExist = await this.userDao.findByEmail(dto.email);

    if (emailExist)
      return {
        status: StatusCodes.CONFLICT,
        message: 'An account already exists for this email',
      };

    try {
      // Ensure user is not in the Adjutor Karma blacklist
      await axios.get(
        `${process.env.ADJUTOR_API_URL}/verification/karma/'${decodeURI(
          dto.email
        )}'`,
        {
          headers: {
            Authorization: `Bearer ${process.env.ADJUTOR_API_KEY}`,
          },
        }
      );

      return {
        status: StatusCodes.FORBIDDEN,
        message:
          'You are not allowed to register on this platform due to your credit score',
      };
    } catch (err) {
      if (err instanceof AxiosError) {
        if (err.response?.status !== 404) {
          return {
            status: StatusCodes.INTERNAL_SERVER_ERROR,
            message:
              'Unable to complete registration at this time. Please try again later',
          };
        }
      } else {
        return {
          status: StatusCodes.INTERNAL_SERVER_ERROR,
          message:
            'Unable to complete registration at this time. Please try again later',
        };
      }
    }

    if (dto.username) {
      const usernameExist = await this.userDao.findByUsername(dto.username);
      if (usernameExist)
        return {
          status: StatusCodes.CONFLICT,
          message: 'An account already exists for this username',
        };
    }

    dto.password = await hashPassword(dto.password);

    logger.info('Creating user...');

    try {
      const { user, wallet } = await this.userDao.createWithWallet(dto);

      const tokens = this.generateAuthTokens(user.id);

      // Remove sensitive information from return data
      delete (user as Partial<User>).password;

      return {
        status: StatusCodes.CREATED,
        message: 'User created successfully',
        data: {
          user,
          wallet,
          ...tokens,
        },
      };
    } catch (error) {
      return {
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        message: 'Unable to create user at this time. Please try again later',
      };
    }
  }

  async login(
    dto: LoginDto,
    _logger: pino.Logger
  ): Promise<ServiceResponse<{ user: User } & AuthTokens>> {
    const user = await this.userDao.findByEmail(dto.email);
    if (!user)
      return {
        status: StatusCodes.BAD_REQUEST,
        message: 'Invalid email',
      };

    const validPassword = await comparePassword(dto.password, user.password);
    if (!validPassword)
      return {
        status: StatusCodes.BAD_REQUEST,
        message: 'Invalid email or password',
      };

    // Remove sensitive information from return data
    delete (user as Partial<User>).password;

    return {
      message: 'User logged in successfully',
      data: {
        user,
        ...this.generateAuthTokens(user.id),
      },
    };
  }

  async refreshToken(token: string): Promise<ServiceResponse<AuthTokens>> {
    const payload = this.verifyRefreshToken(token);
    if (!payload) {
      return {
        status: StatusCodes.BAD_REQUEST,
        message: 'Invalid refresh token provided',
      };
    }

    const user = await this.userDao.findById(payload.userId);
    if (!user)
      return {
        status: StatusCodes.BAD_REQUEST,
        message: 'Invalid refresh token provided',
      };

    return {
      message: 'Token refreshed successfully',
      data: this.generateAuthTokens(payload.userId),
    };
  }

  private generateAuthTokens = (userId: string): AuthTokens => {
    const accessToken = sign({ userId }, process.env.ACCESS_TOKEN_SECRET!, {
      expiresIn: process.env.ACCESS_TOKEN_SECRET_EXPIRES_IN,
    });
    const refreshToken = sign({ userId }, process.env.REFRESH_TOKEN_SECRET!, {
      expiresIn: process.env.REFRESH_TOKEN_SECRET_EXPIRES_IN,
    });

    return { accessToken, refreshToken };
  };

  private verifyRefreshToken = (
    token: string
  ): UserIDJwtPayload | undefined => {
    try {
      const payload = verify(token, process.env.REFRESH_TOKEN_SECRET!);
      return <UserIDJwtPayload>payload;
    } catch (err) {
      return undefined;
    }
  };
}
