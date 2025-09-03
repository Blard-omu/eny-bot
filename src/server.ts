import app from "./app/app";
import { CONFIG } from "./configs";
import dotenv from 'dotenv';
import logger from './utils/logger';
import { createSeedUsers } from './database/seeder/users';
import connectDb from "./database/config.db";

dotenv.config();

const PORT = CONFIG.APPLICATION.PORT || 4000;
const LOCAL_HOST = CONFIG.APPLICATION.HOST || 'http://localhost';
const BASE_URL = CONFIG.APPLICATION.BASE_URL;
const MONGODB_URI = CONFIG.MONGODB.URI; // mongodb

if (process.env.NODE_ENV !== 'test') {
  
    connectDb(MONGODB_URI!)
    .then(async () => {
      await createSeedUsers();
      app.listen(PORT, () => {
        const baseUrl =
          process.env.NODE_ENV === 'production'
            ? `${BASE_URL}`
            : `${LOCAL_HOST}:${PORT}`;
        logger.info(`✅ Server running on port ${PORT}`);
        logger.info(`API BaseUrl available at: ${baseUrl}/api/v1`);
        logger.info(`********************************`);
        logger.info(`Swagger docs available at: ${baseUrl}/api/v1/docs`);
      });
    })
    .catch((err: any) => logger.error(`❌ MongoDB connection error: ${err}`));
}
