import { Command } from 'discord-akairo';
import { CourseClient } from '../../client/CourseClient';
import { Message } from 'discord.js';

export default class TagDelete extends Command {
  public client: CourseClient;

  public constructor() {
    super('tag-delete', {
      category: 'tags',
      ratelimit: 2,
      userPermissions: ['MANAGE_MESSAGES'],
      description: {
        content: 'Deletes a tag.',
        usage: '<tagname>',
        examples: ['<my tagname>'],
      },
      channel: 'guild',
      args: [
        {
          id: 'tagName',
          type: 'lowercase',
          prompt: {
            start: (message: Message): string => `${message.author}, what tag would you like to delete?`,
            retry: (message: Message): string => `${message.author}, please provide a valid tag.`,
          },
        },
      ],
    });
  }

  public async exec(message: Message, { tagName }: { tagName: string }) {
    const tagData = await this.client.db.GetTag(message, tagName);
    if (!tagData)
      message.util!.reply(
        `There is no tag called ${tagName}, so why are you trying to delete a tag that dosn't exist in the first place?`
      );
    if (tagData.userID !== message.author.id)
      return message.util!.reply(`You're not the creator of this command, thereby you cannot delete it.`);
    try {
      await this.client.db.DeleteTag(tagName, message.author, message.guild);
    } catch (error) {
      this.client.logger.error(`Failed to delete tag ${tagName} Error: ${error}`);
      return message.util!.reply(`Something went wrong! Error: ${error.message}`);
    }
    return message.util!.reply(`Alrighty then! Tag **${tagName}** has been deleted.`);
  }
}
