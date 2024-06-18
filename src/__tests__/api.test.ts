import { StatusCodes } from 'http-status-codes';
import { Transaction, User, Wallet } from 'knex';
import request from 'supertest';
import db from '../database/database';
import { default as app, default as server } from '../index';
import { AuthTokens } from '../modules/auth/auth.service';
import { ErrorResponse, TestUser } from './helpers';

describe('API Endpoints Tests', () => {
  let userOne: TestUser, userTwo: TestUser;

  beforeAll(async () => {
    // Delete test data from database
    await db('users')
      .where('email', 'johndoe@gmail.com')
      .orWhere('email', 'janetdoe@gmail.com')
      .del();

    // Create test auth
    let response = await request(app).post('/api/auth/register').send({
      name: 'John Doe',
      username: 'JohnDoe',
      email: 'johndoe@gmail.com',
      password: 'Password@123',
    });
    if (response.status !== StatusCodes.CREATED) {
      console.error('Failed to create user', response.error);
      process.exit(1);
    }

    userOne = response.body.data;

    response = await request(app).post('/api/auth/register').send({
      name: 'Janet Doe',
      username: 'JanetDoe',
      email: 'janetdoe@gmail.com',
      password: 'Password@123',
    });
    if (response.status !== StatusCodes.CREATED) {
      console.error('Failed to create user', response.error);
      process.exit(1);
    }

    userTwo = response.body.data;
  });

  afterAll((done) => {
    server.close();
    done();
  });

  describe('404 Handler', () => {
    it('should return 404 for unknown route', async () => {
      const response = await request(app).get('/api/unknown');
      expect(response.status).toBe(StatusCodes.NOT_FOUND);
    });
  });

  describe('Authentication Routes', () => {
    describe('POST /api/auth/register', () => {
      // TODO: Add one case for a user in the Karma blacklist
      it('should return 400 for invalid dto', async () => {
        const response = await request(app)
          .post('/api/auth/register')
          .send({ name: 'Test User' });

        expect(response.status).toBe(StatusCodes.BAD_REQUEST);
        expect(response.body).toMatchObject<ErrorResponse>({
          error: 'The request body contains invalid data.',
        });
      });

      it('should register a new user', async () => {
        await db('users').where('email', 'test@example.com').del();

        const response = await request(app).post('/api/auth/register').send({
          name: 'Test User',
          username: 'John',
          email: 'test@example.com',
          password: 'Password@123',
        });

        expect(response.status).toBe(StatusCodes.CREATED);
        expect(response.body.data).toHaveProperty('user');
        expect(response.body.data).toHaveProperty('wallet');
        expect(response.body.data).toHaveProperty('accessToken');
        expect(response.body.data).toHaveProperty('refreshToken');
      });

      it('should return 409 for email exists', async () => {
        const response = await request(app).post('/api/auth/register').send({
          name: 'Test User',
          username: 'Wee',
          email: 'test@example.com',
          password: 'Password@123',
        });

        expect(response.status).toBe(StatusCodes.CONFLICT);
        expect(response.body).toMatchObject<ErrorResponse>({
          error: 'An account already exists for this email',
        });
      });

      it('should return 409 for username exists', async () => {
        const response = await request(app).post('/api/auth/register').send({
          name: 'Test User',
          username: 'John',
          email: 'test2@example.com',
          password: 'Password@123',
        });

        expect(response.status).toBe(StatusCodes.CONFLICT);
        expect(response.body).toMatchObject<ErrorResponse>({
          error: 'An account already exists for this username',
        });
      });
    });

    describe('POST /api/auth/login', () => {
      it('should return 400 for invalid dto', async () => {
        const response = await request(app).post('/api/auth/login').send({});

        expect(response.status).toBe(StatusCodes.BAD_REQUEST);
        expect(response.body).toMatchObject<ErrorResponse>({
          error: 'The request body contains invalid data.',
        });
      });

      it('should return 400 for invalid email', async () => {
        const response = await request(app)
          .post('/api/auth/login')
          .send({ email: 'wrong@gmail.com', password: 'Password@123' });

        expect(response.status).toBe(StatusCodes.BAD_REQUEST);
        expect(response.body).toMatchObject<ErrorResponse>({
          error: 'Invalid email',
        });
      });

      it('should return 400 for invalid password', async () => {
        const response = await request(app)
          .post('/api/auth/login')
          .send({ email: 'test@example.com', password: 'Wrong@123' });

        expect(response.status).toBe(StatusCodes.BAD_REQUEST);
        expect(response.body).toMatchObject<ErrorResponse>({
          error: 'Invalid email or password',
        });
      });

      it('should login a user', async () => {
        const response = await request(app).post('/api/auth/login').send({
          email: 'test@example.com',
          password: 'Password@123',
        });

        expect(response.status).toBe(StatusCodes.OK);
        expect(response.body.data).toHaveProperty('user');
        expect(response.body.data).toHaveProperty('accessToken');
        expect(response.body.data).toHaveProperty('refreshToken');
      });
    });

    describe('POST /api/auth/profile', () => {
      it('should return 401 for token is not provided', async () => {
        const response = await request(app).get('/api/auth/profile');

        expect(response.status).toBe(StatusCodes.UNAUTHORIZED);
        expect(response.body).toMatchObject<ErrorResponse>({
          error: 'No authentication token provided',
        });
      });
      it('should return 403 for invalid token', async () => {
        const response = await request(app)
          .get('/api/auth/profile')
          .set('Authorization', 'Bearer invalid-token');

        expect(response.status).toBe(StatusCodes.FORBIDDEN);
        expect(response.body).toMatchObject<ErrorResponse>({
          error: 'Invalid authentication token provided',
        });
      });
      it('should return 200 and user details for valid token', async () => {
        const response = await request(app)
          .get('/api/auth/profile')
          .set('Authorization', `Bearer ${userOne.accessToken}`);

        expect(response.status).toBe(StatusCodes.OK);
        expect(response.body.data).toMatchObject<Omit<User, 'password'>>({
          id: userOne.user.id,
          name: userOne.user.name,
          username: userOne.user.username,
          email: userOne.user.email,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        });
      });
    });

    describe('POST /api/auth/refresh', () => {
      it('should return 400 for token is not provided', async () => {
        const response = await request(app).post('/api/auth/refresh');

        expect(response.status).toBe(StatusCodes.BAD_REQUEST);
        expect(response.body).toMatchObject<ErrorResponse>({
          error: 'Invalid/Missing refresh token',
        });
      });
      it('should return 400 for invalid token provided', async () => {
        const response = await request(app)
          .post('/api/auth/refresh')
          .set('x-refresh-token', 'invalid-token');

        expect(response.status).toBe(StatusCodes.BAD_REQUEST);
        expect(response.body).toMatchObject<ErrorResponse>({
          error: 'Invalid refresh token provided',
        });
      });
      it('should return 200 and new tokens for valid token provided', async () => {
        const response = await request(app)
          .post('/api/auth/refresh')
          .set('x-refresh-token', userOne.refreshToken);

        expect(response.status).toBe(StatusCodes.OK);
        expect(response.body.data).toMatchObject<AuthTokens>({
          accessToken: expect.any(String),
          refreshToken: expect.any(String),
        });
      });
    });
  });

  describe('Wallet Routes', () => {
    describe('GET /api/wallets', () => {
      it('should return 401 for unauthorized access', async () => {
        const response = await request(app).get(`/api/wallets`);

        expect(response.status).toBe(StatusCodes.UNAUTHORIZED);
        expect(response.body).toMatchObject<ErrorResponse>({
          error: 'No authentication token provided',
        });
      });

      it('should return the wallet information for a user', async () => {
        const response = await request(app)
          .get(`/api/wallets`)
          .set('Authorization', `Bearer ${userOne.accessToken}`);

        expect(response.status).toBe(StatusCodes.OK);
        expect(response.body.data).toMatchObject<Wallet>({
          id: expect.any(String),
          userId: userOne.user.id,
          balance: expect.any(Number),
          acctNumber: expect.any(Number),
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        });
      });
    });

    describe('POST /api/wallets/fund', () => {
      it('should return 401 for unauthorized access', async () => {
        const response = await request(app).post(`/api/wallets/fund`);

        expect(response.status).toBe(StatusCodes.UNAUTHORIZED);
        expect(response.body).toMatchObject<ErrorResponse>({
          error: 'No authentication token provided',
        });
      });

      it('should return 400 for invalid dto', async () => {
        const response = await request(app)
          .post(`/api/wallets/fund`)
          .set('Authorization', `Bearer ${userOne.accessToken}`)
          .send({});

        expect(response.status).toBe(StatusCodes.BAD_REQUEST);
        expect(response.body).toMatchObject<ErrorResponse>({
          error: 'The request body contains invalid data.',
        });
      });

      it("should fund user's wallet and return updated wallet information", async () => {
        const response = await request(app)
          .post(`/api/wallets/fund`)
          .set('Authorization', `Bearer ${userOne.accessToken}`)
          .send({
            amount: 10000,
            transactionId: '1234',
          });

        expect(response.status).toBe(StatusCodes.OK);
        expect(response.body.data).toMatchObject<Wallet>({
          id: userOne.wallet.id,
          userId: userOne.user.id,
          balance: 10000,
          acctNumber: userOne.wallet.acctNumber,
          createdAt: userOne.wallet.createdAt,
          updatedAt: expect.any(String),
        });

        userOne.wallet = response.body.data;
      });
    });

    describe('POST /api/wallets/transfer', () => {
      it('should return 401 for unauthorized access', async () => {
        const response = await request(app).post(`/api/wallets/transfer`);

        expect(response.status).toBe(StatusCodes.UNAUTHORIZED);
        expect(response.body).toMatchObject<ErrorResponse>({
          error: 'No authentication token provided',
        });
      });

      it('should return 400 for invalid dto', async () => {
        const response = await request(app)
          .post(`/api/wallets/transfer`)
          .set('Authorization', `Bearer ${userOne.accessToken}`)
          .send({});

        expect(response.status).toBe(StatusCodes.BAD_REQUEST);
        expect(response.body).toMatchObject<ErrorResponse>({
          error: 'The request body contains invalid data.',
        });
      });

      it('should return 404 for invalid recipient account number', async () => {
        const response = await request(app)
          .post(`/api/wallets/transfer`)
          .set('Authorization', `Bearer ${userOne.accessToken}`)
          .send({ amount: 1000, acctNumber: 1234567890 });

        expect(response.status).toBe(StatusCodes.NOT_FOUND);
        expect(response.body).toMatchObject<ErrorResponse>({
          error: 'Recipient not found',
        });
      });

      it('should return 400 for insufficient funds', async () => {
        const response = await request(app)
          .post(`/api/wallets/transfer`)
          .set('Authorization', `Bearer ${userOne.accessToken}`)
          .send({
            amount: userOne.wallet.balance + 1000,
            acctNumber: userTwo.wallet.acctNumber,
          });

        expect(response.status).toBe(StatusCodes.BAD_REQUEST);
        expect(response.body).toMatchObject<ErrorResponse>({
          error: 'Insufficient funds',
        });
      });

      it('should transfer funds and return updated wallet information', async () => {
        let response = await request(app)
          .post(`/api/wallets/transfer`)
          .set('Authorization', `Bearer ${userOne.accessToken}`)
          .send({
            amount: 2000,
            acctNumber: userTwo.wallet.acctNumber,
          });

        expect(response.status).toBe(StatusCodes.OK);
        expect(response.body.data).toMatchObject<Wallet>({
          id: userOne.wallet.id,
          userId: userOne.user.id,
          balance: userOne.wallet.balance - 2000,
          acctNumber: userOne.wallet.acctNumber,
          createdAt: userOne.wallet.createdAt,
          updatedAt: expect.any(String),
        });
        userOne.wallet = response.body.data;

        response = await request(app)
          .get(`/api/wallets`)
          .set('Authorization', `Bearer ${userTwo.accessToken}`);

        expect(response.status).toBe(StatusCodes.OK);
        expect(response.body.data).toMatchObject<Wallet>({
          id: userTwo.wallet.id,
          userId: userTwo.user.id,
          balance: userTwo.wallet.balance + 2000,
          acctNumber: userTwo.wallet.acctNumber,
          createdAt: userTwo.wallet.createdAt,
          updatedAt: expect.any(String),
        });
        userTwo.wallet = response.body.data;
      });
    });

    describe('POST /api/wallets/withdraw', () => {
      it('should return 401 for unauthorized access', async () => {
        const response = await request(app).post(`/api/wallets/withdraw`);

        expect(response.status).toBe(StatusCodes.UNAUTHORIZED);
        expect(response.body).toMatchObject<ErrorResponse>({
          error: 'No authentication token provided',
        });
      });

      it('should return 400 for invalid dto', async () => {
        const response = await request(app)
          .post(`/api/wallets/withdraw`)
          .set('Authorization', `Bearer ${userOne.accessToken}`)
          .send({});

        expect(response.status).toBe(StatusCodes.BAD_REQUEST);
        expect(response.body).toMatchObject<ErrorResponse>({
          error: 'The request body contains invalid data.',
        });
      });

      it('should return 400 for insufficient funds', async () => {
        const response = await request(app)
          .post(`/api/wallets/withdraw`)
          .set('Authorization', `Bearer ${userOne.accessToken}`)
          .send({
            amount: userOne.wallet.balance + 1,
            bankDetails: {
              bankName: 'Zenith',
              acctNumber: 12345678910,
              acctName: 'John Doe',
            },
          });

        expect(response.status).toBe(StatusCodes.BAD_REQUEST);
        expect(response.body).toMatchObject<ErrorResponse>({
          error: 'Insufficient funds',
        });
      });

      it('should withdraw funds', async () => {
        let response = await request(app)
          .post(`/api/wallets/withdraw`)
          .set('Authorization', `Bearer ${userOne.accessToken}`)
          .send({
            amount: 1000,
            bankDetails: {
              bankName: 'Zenith',
              acctName: 'Aaliyah Junaid',
              acctNumber: 12345678910,
            },
          });

        expect(response.status).toBe(StatusCodes.OK);
        expect(response.body.data).toMatchObject<Wallet>({
          id: userOne.wallet.id,
          userId: userOne.user.id,
          balance: userOne.wallet.balance - 1000,
          acctNumber: userOne.wallet.acctNumber,
          createdAt: userOne.wallet.createdAt,
          updatedAt: expect.any(String),
        });

        userOne.wallet = response.body.data;
      });
    });
  });

  describe('Transaction Routes', () => {
    describe('GET /api/transactions', () => {
      it('should return 401 for unauthorized access', async () => {
        const response = await request(app).get(`/api/transactions`);

        expect(response.status).toBe(StatusCodes.UNAUTHORIZED);
        expect(response.body).toMatchObject<ErrorResponse>({
          error: 'No authentication token provided',
        });
      });

      it('should return the transaction history for a user', async () => {
        const response = await request(app)
          .get(`/api/transactions`)
          .set('Authorization', `Bearer ${userOne.accessToken}`);

        expect(response.status).toBe(StatusCodes.OK);
        expect(response.body.data).toBeInstanceOf(Array);

        if (response.body.data.length > 0) {
          expect(response.body.data).toEqual(
            expect.arrayContaining([
              expect.objectContaining<Transaction>({
                id: expect.any(String),
                userId: userOne.user.id,
                amount: expect.any(Number),
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
                type: expect.any(String),
              }),
            ])
          );
        }
      });
    });
  });
});
