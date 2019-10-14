import { Command, Flag } from 'discord-akairo';
import { Message } from 'discord.js';
import { CourseClient } from '../../client/CourseClient';
import { stripIndents } from 'common-tags';

export default class Tag extends Command {
  public client: CourseClient;
  public constructor() {
    super('tag', {
      aliases: ['tag'],
      category: 'tags',
      channel: 'guild',
      clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
      ratelimit: 2,
      description: {
        content: 'Adds a tag.',
        usage: stripIndents`
          tag add <tag name> <tag content>
          tag show <tag name>
          tag delete <tag name>
          tag edit <tag name> <new tag content>,
          tag list
        `,
        examples: ['tag add <my tag> <This is the content of my tag>', 'tag delete <my tag>'],
      },
    });
  }

  public async *args() {
    const method = yield {
      type: [
        ['tag-show', 'show'],
        ['tag-add', 'add'],
        ['tag-delete', 'del', 'delete', 'remove', 'rm'],
        ['tag-edit', 'edit'],
        ['tag-list', 'list'],
      ],
      otherwise: async (message: Message) => {
        // @ts-ignore
        const prefix = await this.handler.prefix(message);
        return message.util!.reply(
          `I don't think you quite understand how this command works... To get more info do ${prefix}help tag`
        );
      },
    };
    return Flag.continue(method);
  }
}
