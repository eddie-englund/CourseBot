import DongClient from 'src/bot/client/DongClient';
import Guild from '../models/Guild';
import * as mongoose from 'mongoose';

export = (client: DongClient) => {
  client.createGuild = async (settings: Object) => {
    const merged = Object.assign({ _id: mongoose.Types.ObjectId() }, settings);

    const newGuild = await new Guild(merged);
    return newGuild.save();
  };

  client.getGuild = async guild => {
    const res = await Guild.findOne({ guildID: guild.id });
    if (res) return res;
    if (!res) {
      const newGuild: Object = {
        guild: guild.name,
        guildID: guild.id
      };
      await client.createGuild(newGuild);
      const newRes = await Guild.findOne({ guildID: guild.id });
      if (newRes) return newRes;
    }
  };

  client.updateGuild = async (guild, settings: Object) => {
    let data = await client.getGuild(guild);

    if (typeof data !== 'object') data = {};
    for (const key in settings) {
      if (data[key] !== settings[key]) data[key] = settings[key];
      else return;
    }
    console.log(
      `Guild "${data.guild}" (${data.guildID}) updated settings: ${Object.keys(settings)}`
    );
    // eslint-disable-next-line consistent-return, no-return-await
    return await data.updateOne(settings);
  };
};
