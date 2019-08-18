import { Command, Flag } from 'discord-akairo';
import { Message } from 'discord.js';
import { CourseClient } from 'src/bot/client/CourseClient';

export default class Tag extends Command {
  public client: CourseClient;
  public constructor() {
    super('tag', {
      aliases: ['tag'],
      category: 'tag',
      channel: 'guild',
      userPermissions: ['MANAGE_MESSAGES'],
      ratelimit: 2,
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
