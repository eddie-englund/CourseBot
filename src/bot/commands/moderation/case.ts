import { Command } from 'discord-akairo';
import { CourseClient } from '../../client/CourseClient';
import { Message } from 'discord.js';

export default class CaseEdit extends Command {
  public client: CourseClient;

  public constructor() {
    super('case-edit', {
      aliases: ['case', 'editcase'],
      userPermissions: ['MANAGE_MESSAGES'],
      clientPermissions: ['SEND_MESSAGES'],
      category: 'moderation',
      description: {
        content: 'edits a case',
        usage: '<case> <new reason>',
      },
      args: [
        {
          id: 'case',
          type: 'integer',
          prompt: {
            start: (message: Message): string => `${message.author}, which case would you like to update?`,
            retry: (message: Message): string => `${message.author}, please provide a valid case number`,
          },
        },
        {
          id: 'reason',
          type: 'string',
          match: 'rest',
          prompt: {
            start: (message: Message): string => `${message.author}, what was the reason for that case?`,
            retry: (message: Message): string => `${message.author}, please provid a reason for that case.`,
          },
        },
      ],
    });
  }

  public async exec(message: Message, args) {
    try {
      await this.client.db.GetCase(args.case);
    } catch (error) {
      this.client.logger.error(error);
      return message.util!.reply(
        `It appears that there is no such entry in the db! The database returned error: ${error.message}`
      );
    }
    try {
      await this.client.db.UpdateCase(args.case, { reason: args.reason });
    } catch (error) {
      this.client.logger.error(error);
      return message.util!.reply(`Something went wrong updating the tag! Error message: ${error.message}`);
    }
    return message.util!.send(`Updated case **${args.case}**`);
  }
}
