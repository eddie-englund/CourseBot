import { Command } from 'discord-akairo';
import { CourseClient } from '../../client/CourseClient';
import { Message } from 'discord.js';

export default class Clear extends Command {
  public client: CourseClient;

  public constructor() {
    super('clear', {
      aliases: ['clear', 'prune'],
      clientPermissions: ['MANAGE_MESSAGES'],
      userPermissions: ['MANAGE_MESSAGES'],
      category: 'moderation',
      description: {
        content: 'Clears specified amount of messages (1-100).',
        usage: '<amount>',
        examples: ['25', '50'],
      },
      args: [
        {
          id: 'amount',
          type: (msg: Message) => {
            if (!msg) return null;
            // @ts-ignore
            const num = parseInt(msg);
            if (isNaN(num)) return null;
            if (num < 1 || num > 100) return null;
            return num;
          },
          prompt: {
            optional: false,
            start: (message: Message): string =>
              `${message.author}, how many messages would you like to clear?`,
            retry: (message: Message): string =>
              `${
                message.author
              }, ehm.. You know what a number is right? Oh, and you can only clear 1-100 messages`,
          },
        },
      ],
    });
  }

  public async exec(message: Message, { amount }: { amount: number }) {
    if (amount > 100) return message.util!.reply('You can only clear a maximum of 100 messages!');
    await message.delete();
    try {
      await message.channel.bulkDelete(amount);
    } catch (error) {
      message.util!.reply('You can only clear a maximum of 100 messages!');
    }
    // @ts-ignore
    return message.util!.reply(`Cleared **${amount}** messages.`).then(msg => msg.delete(10000));
  }
}
