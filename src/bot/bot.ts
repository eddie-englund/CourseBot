import { CourseClient } from './client/CourseClient';
import { Logger } from '@ayana/logger';
const logger = Logger.get(null);
import dotenv from 'dotenv';

// Dotenv
dotenv.config();

const client: CourseClient = new CourseClient({
  URI: process.env.MONGO_CREDENTIALS,
  TOKEN: process.env.TOKEN,
});

// Error handling

client.on('error', error => logger.error(error)).on('warn', warn => logger.warn(warn));

// Initialazation

client.start();
