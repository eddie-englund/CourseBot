import { Command, Argument } from 'discord-akairo';
import { Message } from 'discord.js';
import { stripIndents } from 'common-tags';
import { CourseClient } from 'src/bot/client/CourseClient';

export default class Logs extends Command {
  public client: CourseClient;
  public constructor() {
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
        examples: ['channel modlogs', 'on', 'off'],
      },
      args: [
        {
          id: 'value',
          type: (message: Message, phrase: string) => {
            if (phrase !== 'true' || 'false' || 'off' || 'on') return null;
            return phrase;
          },
          prompt: {
            optional: false,
            start: (message: Message): string => `${message.author}, would you like to turn off or on loggin?`,
            retry: (message: Message): string =>
              `${message.author}, comon now don't be shy! Provide me with either; true, false, on or off`,
          },
        },
      ],
    });
  }

  public async exec(message: Message, { value }: { value: string }) {
    switch (value) {
      case 'on' || 'true':
        try {
          const data = await this.client.getGuild(message.guild);
          if (!data) return message.reply('Error: Database does not exist for this guild');
          await this.client.db.UpdateGuild(message.guild, { guildLog: { active: true } });
          message.util!.reply('Logging has been activated');
        } catch (e) {
          this.client.logger.error(e);
          return message.util!.reply(`Something wen't wrong! Error: ${e.message}`);
        }
        break;
      case 'off' || 'false':
        try {
          await this.client.db.UpdateGuild(message.guild, { guildLog: { active: false } });
          return message.util!.reply('Logging has now been turned off');
        } catch (error) {
          this.client.logger.error(error);
          return message.util!.reply(`Something wen't wrong! Error: ${error.message}`);
        }
    }
  }
}
