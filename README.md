# Mobile Lending API

This is an ExpressJS API that provides authentication, wallet management, and transaction history functionality. The API is built with Node.js and Express.js, and it uses JSON Web Tokens (JWT) for authentication and authorization.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
  - [Authentication Routes](#authentication-routes)
  - [Wallet Routes](#wallet-routes)
  - [Transaction Routes](#transaction-routes)
- [Testing](#testing)
- [Project Structure](#project-structure)
- [License](#license)

## Features

- User authentication (register, login, refresh token)
- User wallet management (fund, transfer, withdraw)
- Transaction history tracking
- Data validation using Zod

## Installation

1. Clone the repository:

```bash
git clone https://github.com/Leeyah-123/lendsqr.git
```

2. Install dependencies:

```bash
cd lendsqr
npm install
```

3. Set up environment variables (see [Environment Variables](#environment-variables) section).

4. Run migrations:

```bash
npm run migrate-latest
```

5. Start the server:

```bash
npm start
```

The API will be running at `http://localhost:5000`.

## Environment Variables

The following environment variables need to be set for the API to function properly:

- `PORT`: The port on which the server should run (default: `5000`).
- `NODE_ENV`: The current environment (development, staging or production).
- `DB_URL`: The connection string for the database (MySQL).
- `ACCESS_TOKEN_SECRET`: The secret key used for signing and verifying JSON Web Tokens (access tokens).
- `ACCESS_TOKEN_SECRET_EXPIRES_IN`: The expiration time for access tokens (e.g., `15m`).
- `REFRESH_TOKEN_SECRET`: The secret key used for signing and verifying refresh tokens.
- `REFRESH_TOKEN_SECRET_EXPIRES_IN`: The expiration time for refresh tokens (e.g., `7d`).
- `ADJUTOR_API_URL`: The URL of the Adjutor API service for user verification.
- `ADJUTOR_API_KEY`: The API key for the Adjutor API service.

You can create a `.env` file in the root directory of the project and add the required environment variables there. The `.env` file should not be committed to the repository as it contains sensitive information.

## API Documentation

### Authentication Routes

- `POST /api/auth/register`: Register a new user.
- `POST /api/auth/login`: Log in an existing user and obtain access and refresh tokens.
- `POST /api/auth/refresh`: Refresh the access token using a valid refresh token.
- `GET /api/auth/profile`: Get the authenticated user's profile information.

### Wallet Routes

- `GET /api/wallets`: Get the authenticated user's wallet information.
- `POST /api/wallets/fund`: Fund the authenticated user's wallet.
- `POST /api/wallets/transfer`: Transfer funds from the authenticated user's wallet to another wallet.
- `POST /api/wallets/withdraw`: Withdraw funds from the authenticated user's wallet.

### Transaction Routes

- `GET /api/transactions`: Get the authenticated user's transaction history.

For detailed information on request and response formats, please refer to the `API_DOCUMENTATION.md` file in the repository.

## Testing

This project uses Jest for unit testing. To run the tests, use the following command:

```bash
npm test
```

## Project Structure

The project follows a modular structure with separate directories for controllers, services, data access objects (DAO), and utilities. Here's an overview of the project structure:

- `src/modules/../*.controller.ts`: Contains the controller classes that handle HTTP requests and responses.
- `src/modules/../*.services.ts`: Contains the service classes that handle business logic.
- `src/modules/../*.validation.ts`: Contains the zod validation schemas.
- `src/__tests__`: Contains the jest unit tests for all endpoints.
- `src/dao`: Contains the data access object classes that interact with the database.
- `src/utils`: Contains utility functions and constants.
- `src/lib`: Contains third-party library wrappers or extensions.
- `src/database`: Contains database configuration and connection setup.
- `src/core`: Contains core classes and types used throughout the application.

## License

This project is licensed under the [MIT License](LICENSE).
