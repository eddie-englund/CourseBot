import { CourseClient } from 'src/bot/client/CourseClient';
import Guild from '../models/Guild';
import * as mongoose from 'mongoose';

export = (client: CourseClient) => {
  client.createGuild = async (settings: Object) => {
    const merged = Object.assign({ _id: mongoose.Types.ObjectId() }, settings);

    const newGuild = await new Guild(merged);
    return newGuild.save();
  };

  client.getGuild = async guild => {
    const res = await Guild.findOne({ guildID: guild.id });
    if (!res) return;
    else return res;
  };

  client.updateGuild = async (guild, settings: Object) => {
    let data = await client.getGuild(guild);

    if (typeof data !== 'object') data = {};
    for (const key in settings) {
      if (data[key] !== settings[key]) data[key] = settings[key];
      else return;
    }
    // eslint-disable-next-line consistent-return, no-return-await
    return await data.updateOne(settings).then(g => {
      console.log(g);
    });
  };
};
