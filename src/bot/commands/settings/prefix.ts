import { Command } from 'discord-akairo';
import DongClient from 'src/bot/client/CourseClient';
import { stripIndents } from 'common-tags';

export default class Prefix extends Command {
  client: DongClient;

  constructor() {
    super('prefix', {
      aliases: ['prefix', 'setprefix', 'newprefix'],
      clientPermissions: ['SEND_MESSAGES'],
      userPermissions: ['MANAGE_CHANNELS', 'MANAGE_GUILD'],
      ratelimit: 2,
      category: 'settings',
      description: {
        content: stripIndents`Available methods:
					 • <new prefix>
					 `,
        usage: '<argument>',
        examples: ['?']
      },
      args: [
        {
          id: 'newPrefix',
          type: 'string',
          prompt: {
            start: message => `${message.author}, please include a valid prefix!`,
            retry: message => `${message.author}, comon, now! I know you can do it.`
          }
        }
      ]
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
