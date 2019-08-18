import { Command } from 'discord-akairo';
import { CourseClient } from 'src/bot/client/CourseClient';
import { Message } from 'discord.js';

export default class TagEdit extends Command {
  client: CourseClient;

  public constructor() {
    super('tag-edit', {
      category: 'tag',
      ratelimit: 2,
      channel: 'guild',
      args: [
        {
          id: 'tagName',
          type: 'existingTag',
          prompt: {
            start: (message: Message): string =>
              `${message.author}, what tag would you like to edit?`,
            retry: (message: Message): string => `${message.author}, please try again.`,
          },
        },
        {
          id: 'newTagContent',
          type: 'string',
          match: 'rest',
          prompt: {
            start: (message: Message): string =>
              `${message.author}, what do you want the tag to say?`,
            retry: (message: Message): string =>
              `${message.author}, please provide the new content for the tag!`,
          },
        },
      ],
    });
  }

  public async exec(
    message: Message,
    { tagName, newTagContent }: { tagName: string; newTagContent: string }
  ) {
    const tagData = await this.client.getTag(tagName, message.guild);
    if (!tagData) return message.util!.reply(`There is no tag with the name \`\`${tagName}\`\``);
    try {
      await this.client.updateTag(tagName, message.guild, { tag: newTagContent });
    } catch (error) {
      console.error(error);
      return message.util!.reply(`Something went wrong! Error: ${error.message}`);
    }
    return message.util!.reply(`Got it! Tag **${tagName}** has been updated!`);
  }
}
