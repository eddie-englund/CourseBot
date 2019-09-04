import { CourseClient } from 'src/bot/client/CourseClient';
import { Guild } from 'discord.js';
import guildSchema from '../../db/models/Guild';
import mongoose from 'mongoose';

export = (client: CourseClient) => {
  client.createGuild = async settings => {
    const merged = Object.assign({ _id: mongoose.Types.ObjectId() }, settings);

    const newGuild = await new guildSchema(merged);
    return newGuild.save();
  };

  client.getGuild = async (guild: Guild) => {
    const res = await guildSchema.findOne({ guildID: guild.id });
    if (!res) return;
    else return res;
  };

  client.updateGuild = async (guild, settings: {}) => {
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
