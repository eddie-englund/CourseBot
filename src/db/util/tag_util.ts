import Tag from '../models/Tag';
import * as mongoose from 'mongoose';
import { CourseClient } from '../../bot/client/CourseClient';
import { User, Guild } from 'discord.js';

export = (client: CourseClient) => {
  client.getTag = async (id: any, guild: Guild) => {
    const data = await Tag.findOne({ id: id, guildID: guild.id });
    if (!data) return;
    return data;
  };

  client.createTag = async settings => {
    const merged = Object.assign({ _id: mongoose.Types.ObjectId() }, settings);

    const newTag = await new Tag(merged);
    return newTag.save();
  };

  client.updateTag = async (id: string, guild: Guild, user: User, settings: {}) => {
    let data = await client.getTag(id, guild.id);

    if (typeof data !== 'object') data = {};
    for (const key in settings) {
      if (data[key] !== settings[key]) data[key] = settings[key];
      else return;
    }
    // eslint-disable-next-line consistent-return, no-return-await
    return await data.updateOne(settings);
  };

  client.deleteTag = async (id: string, user: User) => {
    let data = await client.getTag(id, user);
    if (!data) throw new Error(`There is no tag called ${id} in the database`);
    return Tag.deleteOne({ id: id, userID: user.id });
  };
};
