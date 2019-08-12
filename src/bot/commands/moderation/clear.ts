import { Command } from 'discord-akairo';
import CourseClient from 'src/bot/client/CourseClient';
import { Message } from 'discord.js';

export default class Clear extends Command {
  client: CourseClient;

  constructor() {
    super('clear', {
      aliases: ['clear', 'prune'],
      clientPermissions: ['MANAGE_MESSAGES'],
      userPermissions: ['MANAGE_MESSAGES'],
      args: [
        {
          id: 'amount',
          type: number => {
            // @ts-ignore
            if (!number || isNaN(number)) return null;
            // @ts-ignore
            const num = parseInt(number);
            if (num < 1 || num > 100) return null;
            return num;
          },
          prompt: {
            optional: false,
            start: (message: Message) =>
              `${message.author}, how many messages do you want me to delete?`,
            retry: (message: Message) =>
              `${message.author}, comon now! Provide me with a valid number from 1 - 100!`
          }
        }
      ]
    });
  }

  public async exec(message: Message, { amount }: { amount: number }) {
    try {
      await message.delete();
      await message.channel.bulkDelete(amount);
      // @ts-ignore
      return message.util!.send(`Deleted ${amount} messages`).then(m => m.delete(5000));
    } catch (error) {
      console.error(error);
      return message.reply(`Error: ${error.message}`);
    }
  }
}
