import { Command } from 'discord-akairo';
import { CourseClient } from '../../client/CourseClient';
import { Message } from 'discord.js';

export default class TagEdit extends Command {
  public client: CourseClient;

  public constructor() {
    super('tag-edit', {
      category: 'tags',
      ratelimit: 2,
      channel: 'guild',
      userPermissions: ['MANAGE_CHANNELS'],
      description: {
        content: 'Edits a tag.',
        usage: '<tagname> <tag content>',
        examples: ['<course> <new content here>'],
      },
      args: [
        {
          id: 'tagName',
          type: 'existingTag',
          prompt: {
            start: (message: Message): string => `${message.author}, what tag would you like to edit?`,
            retry: (message: Message): string => `${message.author}, please try again.`,
          },
        },
        {
          id: 'newTagContent',
          type: 'string',
          match: 'rest',
          prompt: {
            start: (message: Message): string => `${message.author}, what do you want the tag to say?`,
            retry: (message: Message): string => `${message.author}, please provide the new content for the tag!`,
          },
        },
      ],
    });
  }

  public async exec(message: Message, { tagName, newTagContent }: { tagName: string; newTagContent: string }) {
    const tagData = await this.client.db.GetTag(message, tagName);
    if (!tagData) return message.util!.reply(`There is no tag with the name \`\`${tagName}\`\``);
    if (tagData.userID !== message.author.id)
      return message.util!.reply(
        `Sorry, cannot edit the tag **${tagName}** because you're not the creator of this tag`
      );
    try {
      await this.client.db.UpdateTag(message, tagName, { tag: newTagContent });
    } catch (error) {
      console.error(error);
      return message.util!.reply(`Something went wrong! Error: ${error.message}`);
    }
    return message.util!.reply(`Got it! Tag **${tagName}** has been updated!`);
  }
}
