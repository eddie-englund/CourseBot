import Tag from '../models/Tag';
import * as mongoose from 'mongoose';
import CourseClient from '../../bot/client/CourseClient';
import { Guild } from 'discord.js';

export = (client: CourseClient) => {
  client.getTag = async (id: string, guild: Guild) => {
    const data = await Tag.findOne({ id: id, guildID: guild.id });
    if (!data) return;
    return data;
  };

  client.createTag = async settings => {
    const merged = Object.assign({ _id: mongoose.Types.ObjectId() }, settings);

    const newTag = await new Tag(merged);
    return newTag.save();
  };

  client.updateTag = async (id: string, guild: Guild, settings) => {
    let data = await client.getTag(id, guild);

    if (typeof data !== 'object') data = {};
    for (const key in settings) {
      if (data[key] !== settings[key]) data[key] = settings[key];
      else return;
    }
    // eslint-disable-next-line consistent-return, no-return-await
    return await data.updateOne(settings);
  };

  client.deleteTag = async (id: string, guild: Guild) => {
    let data = await client.getTag(id, guild);
    if (!data) throw new Error(`There is no tag called ${id} in the database`);
    return Tag.deleteOne({ id: id, guildID: guild.id });
  };

  client.getTagAliases = async (guild: Guild) => {
    const data = await Tag.find({ guildID: guild.id });
    if (!data) return;
    else {
      const tagMap = data.map(tag => tag.id);
      return tagMap;
    }
  };
};
