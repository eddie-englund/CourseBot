import { Command } from 'discord-akairo';
import { CourseClient } from 'src/bot/client/CourseClient';
import { Message } from 'discord.js';

export default class CaseEdit extends Command {
  public client: CourseClient;

  public constructor() {
    super('case-edit', {
      aliases: ['case', 'editcase'],
      userPermissions: ['MANAGE_MESSAGES'],
      clientPermissions: ['SEND_MESSAGES'],
      args: [
        {
          id: 'case',
          type: 'integer',
          match: 'option',
          flag: ['--ref', '-r='],
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
    const data = await this.client.getCase(args.case);
    if (!data) return message.util.reply(`There is no case with the id **${args.case}**`);
  }
}
