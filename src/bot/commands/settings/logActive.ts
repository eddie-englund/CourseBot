import { Command } from 'discord-akairo';
import { Message } from 'discord.js';
import { stripIndents } from 'common-tags';
import CourseClient from '../../client/CourseClient';

export default class Logs extends Command {
  client: CourseClient;
  constructor() {
    super('setting-log', {
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
          id: 'value',
          type: 'string',
          prompt: {
            optional: false,
            start: (message: Message): string =>
              `${message.author}, would you like to turn off or on loggin?`,
            retry: (message: Message): string =>
              `${
                message.author
              }, comon now don't be shy! Provide me with either; true, false, on or off`
          }
        }
      ]
    });
  }

  async exec(message: Message, { value }: { value: string }) {
    switch (value) {
      case 'on' || 'true':
        try {
          const data = await this.client.getGuild(message.guild);
          if (!data)
            return message.reply('Error: Database does not exist for this guild');
          await this.client.updateGuild(message.guild, { guildLog: { active: true } });
          message.util!.reply('Logging has been activated');
        } catch (e) {
          console.error(e);
          message.util!.reply(`Something wen't wrong! Error: ${e.message}`);
        }
        break;
      case 'off' || 'false':
        try {
          await this.client.updateGuild(message.guild, { guildLOg: { active: false } });
          message.util!.reply('Logging has now been turned off');
        } catch (error) {
          console.error(error);
          message.util!.reply(`Something wen't wrong! Error: ${error.message}`);
        }
    }
  }
}
