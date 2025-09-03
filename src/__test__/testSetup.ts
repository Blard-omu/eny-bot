import mongoose from 'mongoose';
import dotenv from 'dotenv';
import logger from '../utils/logger';

dotenv.config({ path: '.env.test' });

export const connectTestDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_TEST_URI || 'mongodb+srv://blard:2tU9o7pJZ7ucEOWC@cluster0.qcnezm3.mongodb.net/test_data?retryWrites=true&w=majority');
    logger.info('✅ Test DB connected');
  } catch (err) {
    logger.error(`❌ Failed to connect to Test DB: ${err}`);
    process.exit(1);
  }
};

export const disconnectTestDB = async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
  logger.info('✅ Cleaned up and disconnected from Test DB');
};
