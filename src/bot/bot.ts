import { CourseClient } from './client/CourseClient';
import { Logger } from '@ayana/logger';
const logger = Logger.get(null);
import dotenv from 'dotenv';

// Dotenv
dotenv.config();

const client: CourseClient = new CourseClient({ URI: process.env.MONGO_CREDENTIALS, TOKEN: process.env.TOKEN });

// Utility
import guild_util = require('../db/util/guild_util');
import profile_util = require('../db/util/profile_util');
import tag_util = require('../db/util/tag_util');
import case_util = require('../db/util/case_util');

guild_util(client);
profile_util(client);
tag_util(client);
case_util(client);

// Error handling

client
  // @ts-ignore
  .on('error', error => logger.error(error))
  .on('warn', warn => logger.warn(warn));

// Initialazation

client.start();
