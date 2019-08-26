import { config } from './config';
import * as db from '../db/init';
import express, { Application } from 'express';
import helmet from 'helmet';
import { logger, TOPICS, EVENTS } from '../bot/util/logger';
import cors from 'cors';
import graphqlHTTP from 'express-graphql';
import schema from './graphql/schema';

require('dotenv').config();

const app: Application = express();
app.use(helmet());
app.use(cors());

app.use(
  '/graphql',
  graphqlHTTP({
    schema,
    graphiql: true,
  })
);

db.init();
app.listen(config.PORT, () => {
  logger.info(`Server is now running on port: ${config.PORT}`, {
    topic: TOPICS.EXPRESS,
    event: EVENTS.READY,
  });
});
