import { StatusCodes } from 'http-status-codes';
import * as jwt from 'jsonwebtoken';
import pino from 'pino';
import { ServiceResponse } from '../../core/types';
import { LoginDto, RegisterDto } from './auth.validation';

export default class AuthService {
  private getToken(payload: object, expiresIn = '30d') {
    return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn });
  }

  private verifyToken(token: string) {
    return <jwt.UserIDJwtPayload>jwt.verify(token, process.env.JWT_SECRET!);
  }

  async register(
    dto: RegisterDto,
    logger: pino.Logger
  ): Promise<ServiceResponse> {
    return {
      status: StatusCodes.NOT_IMPLEMENTED,
      message: 'Not implemented',
    };
    // const emailExist = await User.findOne({ email: dto.email });

    // if (emailExist)
    //   return {
    //     status: StatusCodes.CONFLICT,
    //     message: 'User already exist',
    //   };

    // const { password, companyName, ...userData } = dto;

    // const newUser = new User({
    //   ...userData,
    //   password,
    //   company: newCompany,
    //   role: UserRoleEnum.ADMIN,
    // });

    // newCompany.admin = newUser;

    // const createdUser = await newUser.save();

    // if (!createdUser) {
    //   return {
    //     status: StatusCodes.BAD_REQUEST,
    //     message: 'Error creating user',
    //   };
    // }

    // logger.info({
    //   message: 'Creating user',
    //   data: userData,
    // });

    // return {
    //   status: StatusCodes.CREATED,
    //   message: `User created successfully`,
    // };
  }

  async login(dto: LoginDto, logger: pino.Logger): Promise<ServiceResponse> {
    return {
      status: StatusCodes.NOT_IMPLEMENTED,
      message: 'Not implemented',
    };
    // const user = await User.findOne({
    //   $or: [{ email: dto.emailOrUsername }, { username: dto.emailOrUsername }],
    // });

    // if (!user)
    //   return {
    //     status: StatusCodes.BAD_REQUEST,
    //     message: 'Invalid email or username',
    //   };

    // const match = await compare(dto.password, user.password);
    // if (!match)
    //   return {
    //     status: StatusCodes.UNAUTHORIZED,
    //     message: 'Incorrect password',
    //   };

    // const token = this.getToken({
    //   id: user._id,
    //   email: user.email,
    //   username: user.username,
    // });

    // const { password, ...userData } = user.toObject();

    // logger.info({ message: 'Logging in user', data: userData });

    // return {
    //   message: 'User logged in',
    //   data: {
    //     token,
    //     user: userData,
    //   },
    // };
  }
}
