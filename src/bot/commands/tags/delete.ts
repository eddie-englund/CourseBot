import { Command } from 'discord-akairo';
import { CourseClient } from 'src/bot/client/CourseClient';
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
          type: 'tag',
          match: 'content',
          prompt: {
            start: (message: Message): string => `${message.author}, what tag would you like to delete?`,
          },
        },
      ],
    });
  }

  public async exec(message: Message, { tagName }: { tagName: string }) {
    const checkData = await this.client.getTag(tagName, message.guild);
    if (!checkData)
      return message.util!.reply("Why are you trying to delete a tag that does't exist in the first place?!");
    await this.client.deleteTag(tagName, message.guild);
    return message.util!.reply(`Alrighty then! Tag **${tagName}** has been deleted.`);
  }
}
