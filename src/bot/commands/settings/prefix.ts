import { Command } from 'discord-akairo';
import { CourseClient } from 'src/bot/client/CourseClient';
import { stripIndents } from 'common-tags';
import { Message } from 'discord.js';

export default class Prefix extends Command {
  public client: CourseClient;

  constructor() {
    super('setting-prefix', {
      clientPermissions: ['SEND_MESSAGES'],
      userPermissions: ['MANAGE_GUILD'],
      ratelimit: 2,
      category: 'settings',
      description: {
        content: stripIndents`Available methods:
					 • <new prefix>
					 `,
        usage: '<argument>',
        examples: ['?'],
      },
      args: [
        {
          id: 'newPrefix',
          type: 'string',
          prompt: {
            optional: false,
            start: (message: Message) =>
              `${message.author}, what would you like the set the prefix to?`,
            retry: (message: Message) => `${message.author}, please try again.`,
          },
        },
      ],
    });
  }

  async exec(message, { newPrefix }) {
    try {
      await this.client.updateGuild(message.guild, { prefix: newPrefix });
      return message.reply(`Prefix has no been set to: ${newPrefix}`);
    } catch (error) {
      console.error(error);
      return message.reply('Seems like something went wrong. Try again!');
    }
  }
}
