import { CourseClient } from './client/CourseClient';
import { TOPICS, EVENTS } from './util/logger';
import * as db from '../db/init';
const dotenv = require('dotenv').config();

// Dotenv
dotenv;

const client: CourseClient = new CourseClient();

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
  .on('error', error => client.logger.error(error, { topic: TOPICS.DISCORD, event: EVENTS.ERROR }))
  .on('warn', warn => client.logger.warn(warn, { topic: TOPICS.DISCORD, event: EVENTS.WARN }));

// Initialazation
db.init();
client.login(process.env.TOKEN);
