import mongoose from 'mongoose';
import { Logger } from '@ayana/logger';
const logger = Logger.get(null);

export const init = () => {
  mongoose.connect(process.env.MONGO_CREDENTIALS || 'mongodb://localhost:27017/Course', {
    useNewUrlParser: true,
    autoIndex: true,
    reconnectTries: Number.MAX_VALUE,
    reconnectInterval: 500,
    poolSize: 5,
    connectTimeoutMS: 10000,
    family: 4,
  });
  mongoose.Promise = global.Promise;

  mongoose.connection.on('connected', () => {
    logger.info('Client has connected to database');
  });

  mongoose.connection.on('err', err => {
    logger.error(err);
  });

  mongoose.connection.on('disconnected', () => {
    logger.warn('Disconnected from database');
  });
};
