import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { router } from './routes/index.js';
import { errorHandler } from './middlewares/error-handler.js';
import { swaggerRouter } from './docs/swagger.js';

export const buildApp = () => {
  const app = express();

  app.use(helmet());
  app.use(cors());
  app.use(express.json());

  app.get('/healthz', (_req, res) => {
    res.json({ status: 'ok' });
  });

  app.use('/swagger', swaggerRouter);
  app.use('/api', router);
  app.use(errorHandler);

  return app;
};
