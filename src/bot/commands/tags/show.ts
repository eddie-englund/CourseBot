import { Command } from 'discord-akairo';
import { CourseClient } from 'src/bot/client/CourseClient';
import { Message } from 'discord.js';
import Tag from '../../../db/models/Tag';

export default class TagShow extends Command {
  public client: CourseClient;

  public constructor() {
    super('tag-show', {
      category: 'tags',
      channel: 'guild',
      userPermissions: ['SEND_MESSAGES'],
      description: {
        content: 'Adds a tag.',
        usage: '<tagname>',
        examples: ['<course>'],
      },
      ratelimit: 2,
      args: [
        {
          id: 'tagName',
          match: 'content',
          type: 'lowercase',
          prompt: {
            start: (message: Message): string => `${message.author}, what tag would you like to see?`,
            retry: (message: Message): string => `${message.author}, please provide a valid tag`,
          },
        },
      ],
    });
  }

  public async exec(message: Message, { tagName }: { tagName: string }): Promise<Message | Message[] | void> {
    const tagData = await Tag.findOne({ id: tagName });
    if (!tagData) return message.reply(`The tag \`\`${tagName}\`\` does not exist!`);

    return message.util!.send(tagData.tag);
  }
}
