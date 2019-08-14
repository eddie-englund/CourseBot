import DongClient from "./client/CourseClient";
import { init } from "../db/init";
const dotenv = require("dotenv").config();
dotenv;
const client: DongClient = new DongClient();
// Utility
require("../db/util/guild_util")(client);
require("../db/util/profile_util")(client);
require("../db/util/tag_util")(client);
require("./util/log")(client);

init();
client.login(process.env.TOKEN);
