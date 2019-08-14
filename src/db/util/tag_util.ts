import Tag from "../models/Tag";
import * as mongoose from "mongoose";
import CourseClient from "../../bot/client/CourseClient";
import { Guild } from "discord.js";

export = (client: CourseClient) => {
  client.getTag = async (id: string, guild: Guild) => {
    const data = await Tag.findOne({ id: id, guildID: guild.id});
    if (!data) return;
    return data;
  };

  client.createTag = async settings => {
    const merged = Object.assign({ _id: mongoose.Types.ObjectId() }, settings);

    const newTag = await new Tag(merged);
    return newTag.save();
  };
    
    client.updateTag = async (id: string, guild: Guild, settings) {
        let data = await client.getGuild(guild);

        if (typeof data !== 'object') data = {};
        for (const key in settings) {
          if (data[key] !== settings[key]) data[key] = settings[key];
          else return;
        }
        // eslint-disable-next-line consistent-return, no-return-await
        return await data.updateOne(settings);
  }
};
