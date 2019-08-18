import { Command } from 'discord-akairo';
import { CourseClient } from 'src/bot/client/CourseClient';
import { Message, Channel } from 'discord.js';

export class logChannel extends Command {
  public client: CourseClient;

  public constructor() {
    super('setting-logchannel', {
      ratelimit: 2,
      clientPermissions: ['SEND_MESSAGES', 'MANAGE_CHANNELS'],
      channel: 'guild',
      category: 'settings',
      args: [
        {
          id: 'channel',
          type: 'channel',
          prompt: {
            optional: false,
            start: (message: Message): string =>
              `${message.author}, what channel would you like to me to logg to?`,
            retry: (message: Message): string => `${message.author}, please provide a valid channel.`,
          },
        },
      ],
    });
  }

  public async exec(message: Message, { channel }: { channel: Channel }) {
    if (channel.type !== 'text') return message.util!.reply(`The channel provided is not a text channel!`);

    try {
      await this.client.updateGuild(message.guild, { guildLog: { channel: channel.id } });
    } catch (e) {
      console.error(e);
      return message.util!.reply(`Something went wrong! Error: ${e.message}`);
    }
    return message.util!.reply(`Log channel has been updated to ${channel}`);
  }
}
