import { env } from '../../infrastructure/config/env.js';
import { buildApp } from './app.js';
import { connectToDatabase } from '../../infrastructure/db/connection.js';
import { logger } from '../../infrastructure/logging/logger.js';

const bootstrap = async () => {
  await connectToDatabase();
  const app = buildApp();
  app.listen(env.PORT, () => {
    logger.info(`HTTP server running on port ${env.PORT}`);
  });
};

bootstrap().catch((error) => {
  logger.error({ err: error }, 'Failed to bootstrap server');
  process.exit(1);
});
