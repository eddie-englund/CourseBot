import { Command } from 'discord-akairo';
import { CourseClient } from 'src/bot/client/CourseClient';
import { Message } from 'discord.js';
import { Schema } from 'mongoose';

export default class InitGuild extends Command {
  public client: CourseClient;

  public constructor() {
    super('setting-init', {
      ratelimit: 2,
      userPermissions: ['MANAGE_MESSAGES'],
      channel: 'guild',
      category: 'settings',
    });
  }

  public async exec(message: Message) {
    const data = await this.client.db.GetGuild(message.guild);

    if (data) {
      return message.util!.reply('This guild already has a db instance!');
    } else {
      await this.client.db.CreateGuild(message.guild);
      return message.util!.reply('This guild has now been initalized!');
    }
  }
}
