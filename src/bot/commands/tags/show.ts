import { Command } from 'discord-akairo';
import { CourseClient } from 'src/bot/client/CourseClient';
import { Message } from 'discord.js';

export default class TagShow extends Command {
  client: CourseClient;

  public constructor() {
    super('tag-show', {
      category: 'tags',
      channel: 'guild',
      userPermissions: ['SEND_MESSAGES'],
      ratelimit: 2,
      args: [
        {
          id: 'tagName',
          match: 'content',
          type: 'lowercase',
          prompt: {
            start: (message: Message): string =>
              `${message.author}, what tag would you like to see?`,
          },
        },
      ],
    });
  }

  public async exec(
    message: Message,
    { tagName }: { tagName: string }
  ): Promise<Message | Message[] | void> {
    const tagData = await this.client.getTag(tagName, message.guild);
    if (!tagData) return message.reply(`The tag \`\`${tagName}\`\` does not exist!`);

    return message.util!.send(tagData.tag);
  }
}
