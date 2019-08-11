import DongClient from './client/DongClient';
import { init } from '../db/init';

const client: DongClient = new DongClient();
// Utility
require('../db/util/guild_util')(client);
require('../db/util/profile_util')(client);

const token: string = process.env.TOKEN;
init();
client.login(token);
