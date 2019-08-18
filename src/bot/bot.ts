import { CourseClient } from './client/CourseClient';
import * as db from '../db/init';
const dotenv = require('dotenv').config();
// Dotenv
dotenv;

// Declare client
const client: CourseClient = new CourseClient();

// Utility
import guild_util = require('../db/util/guild_util');
import profile_util = require('../db/util/profile_util');
import tag_util = require('../db/util/tag_util');
import log = require('./util/log');

guild_util(client);
profile_util(client);
tag_util(client);
log(client);

// Initialazation

db.init();
client.login(process.env.TOKEN);
