import { Command } from 'discord-akairo';
import { CourseClient } from 'src/bot/client/CourseClient';
import { Message } from 'discord.js';
import { Schema } from 'mongoose';

export class InitGuild extends Command {
  public client: CourseClient;

  public constructor() {
    super('setting-init', {
      ratelimit: 2,
      userPermissions: ['MANAGE_MESSAGES'],
      channel: 'guild',
    });
  }

  public async exec(message: Message, { clean }: { clean: string }) {
    const data = await this.client.getGuild(message.guild);
    const guild: Schema = {
      guildID: message.guild.id,
      guild: message.guild.name,
    };
    if (data) {
      return message.util!.reply(
        'This guild already has a db instance! If you really want to clean the db include the argument of "clean" after the command name.'
      );
    } else {
      await this.client.createGuild(guild);
      return message.util!.reply('This guild has now been initalized!');
    }
  }
}
