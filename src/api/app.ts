import { config } from './config';
import { init } from '../db/init';
import * as restify from 'restify';
import * as mongoose from 'mongoose';
import corsMiddleware = require('restify-cors-middleware');

const server = restify.createServer();

// Middleware

const cors = corsMiddleware({
  preflightMaxAge: 5, //Optional
  origins: ['http://localhost:3001']
});

server.pre(cors.preflight);
server.use(cors.actual);

server.use(restify.plugins.bodyParser());

server.listen(config.PORT, () => {
  init();
});

const db: mongoose.connection = mongoose.connection;

db.once('open', () => {
  require('./routes/user')(server);
  require('./routes/guild')(server);

  server.get(
    '/public/*',
    restify.plugins.serveStatic({
      directory: '.',
      default: 'index.html'
    })
  );
  console.log(`Server started on port ${config.PORT}`);
});
