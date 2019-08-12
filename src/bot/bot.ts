import DongClient from './client/CourseClient';
import { init } from '../db/init';
import * as dotenv from 'dotenv';

// Dotenv init

dotenv.config();

const client: DongClient = new DongClient();
// Utility
require('../db/util/guild_util')(client);
require('../db/util/profile_util')(client);
require('./util/log')(client);

const token: string = process.env.TOKEN;
init();
client.login(token);
