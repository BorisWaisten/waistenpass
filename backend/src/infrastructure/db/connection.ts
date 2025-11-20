import mongoose from 'mongoose';
import { env } from '../config/env.js';
import { logger } from '../logging/logger.js';

export const connectToDatabase = async (): Promise<void> => {
  try {
    await mongoose.connect(env.MONGO_URI);
    logger.info('Connected to MongoDB');
  } catch (error) {
    logger.error({ err: error }, 'Failed to connect to MongoDB');
    throw error;
  }
};
