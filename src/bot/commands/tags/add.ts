import { Command } from 'discord-akairo';
import { CourseClient } from 'src/bot/client/CourseClient';
import { Message } from 'discord.js';

export default class TagAdd extends Command {
  public client: CourseClient;

  public constructor() {
    super('tag-add', {
      category: 'tags',
      channel: 'guild',
      userPermissions: ['MANAGE_MESSAGES'],
      description: {
        content: 'Adds a tag.',
        usage: '<tagname> <tag content>',
        examples: ['<course> <DesignCourse(courestro)>'],
      },
      ratelimit: 2,
      args: [
        {
          id: 'tagName',
          type: 'lowercase',
          prompt: {
            start: (message: Message) => `${message.author}, what do you want to name the tag?`,
            retry: (message: Message) => `${message.author}, please try again.`,
          },
        },
        {
          id: 'tagContent',
          match: 'rest',
          type: 'lowercase',
          prompt: {
            start: (message: Message) => `${message.author}, what would you like the tag to say?`,
          },
        },
      ],
    });
  }

  public async exec(message: Message, { tagName, tagContent }: { tagName: any; tagContent: string }) {
    if (tagName && tagName.length >= 1900) {
      return message.util!.reply('messages have a limit of 2000 characters!');
    }

    if (tagContent && tagContent.length >= 1950) {
      return message.util!.reply('messages has a maximun length of 2000 characters!');
    }

    const tagData = await this.client.db.GetTag(message, tagName);
    if (tagData) return message.reply('This tag name already exists! Please pick another name!');

    await this.client.db.NewTag(message, tagName, tagContent);

    return message.util!.reply(`Nice! your tag **${tagName.substring(0, 1900)}** has been created!`);
  }
}
