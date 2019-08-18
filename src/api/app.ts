import { config } from './config';
import { init } from '../db/init';
import * as restify from 'restify';
import * as mongoose from 'mongoose';
import corsMiddleware = require('restify-cors-middleware');

// Routes

import userRoute = require('./routes/user');
import guildRoute = require('./routes/guild');

export const server = restify.createServer();

// Middleware

const cors = corsMiddleware({
  preflightMaxAge: 5, //Optional
  origins: ['http://localhost:3001'],
});

server.pre(cors.preflight);
server.use(cors.actual);

server.use(restify.plugins.bodyParser());

server.listen(config.PORT, () => {
  init();
});

const db: mongoose.connection = mongoose.connection;

db.once('open', () => {
  guildRoute(server);
  userRoute(server);
  console.log(`Server started on port ${config.PORT}`);
});
