import { Command } from 'discord-akairo';
import DongClient from 'src/bot/client/CourseClient';
import { Message } from 'discord.js';
import { stripIndents } from 'common-tags';

export default class Logs extends Command {
  client: DongClient;
  constructor() {
    super('logs', {
      aliases: ['logs', 'log'],
      userPermissions: ['MANAGE_CHANNELS', 'MANAGE_GUILD'],
      channel: 'guild',
      clientPermissions: ['SEND_MESSAGES'],
      category: 'settings',
      description: {
        content: stripIndents`Available methods:
					 • channel \`<channel name>\`
					 • on \`<no argument required>\`
					 • off \`<no argument required>\`
					 `,
        usage: '<method> <...arguments>',
        examples: ['channel modlogs', 'on', 'off']
      },
      args: [
        {
          id: 'Setting',
          prompt: {
            optional: false,
            start: message =>
              `${
                message.author
              }, plase include a valid log setting. For more info: do \`\`@Course help log\`\``,
            retry: message => `${message.author}, comon, I know you can do it!`
          }
        },
        {
          id: 'newSetting',
          match: 'rest',
          prompt: {
            optional: true,
            start: message => `${message.author}, you need to include the new vale or channel!`,
            retry: message => `${message.author}, you need to include the new vale or channel!`
          }
        }
      ]
    });
  }

  async exec(message: Message, { Setting, newSetting }) {
    switch (Setting) {
      case 'channel':
        if (!newSetting) {
          return message.reply(`please include a valid channel name!`);
        }
        await this.client.updateGuild(message.guild, { guildLog: { channel: newSetting } });
        message.reply(`The logs channel has now been moved to \`\`${newSetting}\`\``);
        break;
      case 'off':
        await this.client.updateGuild(message.guild, { guildLog: { active: false } });
        message.reply(`Logging has now been turned: \`\`off\`\``);
        break;
      case 'on':
        await this.client.updateGuild(message.guild, { guildLog: { active: true } });
        message.reply(`Logging has now been turned: \`\`on\`\``);
        break;
      default:
        message.reply(
          'You have not provided a valid setting to update. Valid settings are: "channel","off" and "on"'
        );
    }
  }
}
