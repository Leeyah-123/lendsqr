import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import helmet from 'helmet';
import pino from 'pino';

import auth from './modules/auth';
import transactions from './modules/transactions';
import wallets from './modules/wallets';

import { errorHandler, logger } from './middlewares';

dotenv.config();

const rootLogger = pino().child({
  context: 'server',
});

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors()); // TODO: Set CORS origin(s)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(helmet());

// Custom middlewares
app.use(logger);

// Define Routes
const apiRouter = express.Router();

apiRouter.use('/auth', auth);
apiRouter.use('/transactions', transactions);
apiRouter.use('/wallets', wallets);

// Attach Routes to server
app.use('/api', apiRouter);
app.use('/ping', (req, res) => {
  res.json({ message: 'pong' });
});

// Catch 404 routes
app.use((_req, res) => {
  res.status(404).json({
    error: 'Not found',
  });
});

// Error Boundary
app.use(errorHandler);

const server = app.listen(PORT, async () => {
  rootLogger.info(`App listening on port ${PORT}`);
});

export default server;
