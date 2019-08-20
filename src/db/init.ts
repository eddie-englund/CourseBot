import * as mongoose from 'mongoose';
import { logger, TOPICS, EVENTS } from '../bot/util/logger';

export const init = () => {
  const dbOptions = {
    useNewUrlParser: true,
    autoIndex: true,
    reconnectTries: Number.MAX_VALUE,
    reconnectInterval: 500,
    poolSize: 5,
    connectTimeoutMS: 10000,
    family: 4,
  };
  mongoose.connect('mongodb://localhost:27017/Course', dbOptions);
  mongoose.set('useFindAndModify', false);
  mongoose.Promise = global.Promise;

  mongoose.connection.on('connected', () => {
    logger.info('Client has connected to database', { topic: TOPICS.DATABASE, event: EVENTS.CONNECT });
  });

  mongoose.connection.on('err', err => {
    logger.error(err, { topic: TOPICS.DATABASE, events: EVENTS.ERROR });
  });

  mongoose.connection.on('disconnected', () => {
    logger.warn('Disconnected from database', { topic: TOPICS.DATABASE, event: EVENTS.WARN });
  });
};
