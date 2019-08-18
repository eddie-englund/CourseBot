import { CourseClient } from 'src/bot/client/CourseClient';
import * as db from '../db/init';
const dotenv = require('dotenv').config();
// Dotenv
dotenv;

// Declare client
const client: CourseClient = new CourseClient();

// Utility
require('../db/util/guild_util')(client);
require('../db/util/profile_util')(client);
require('../db/util/tag_util')(client);
require('./util/log')(client);

// Initialazation

db.init();
client.login(process.env.TOKEN);
