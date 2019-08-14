import { Command, Flag } from 'discord-akairo';
import { Message } from 'discord.js';
import { stripIndents } from 'common-tags';
import CourseClient from '../../client/CourseClient';
import TagModel from '../../../db/models/Tag';

export default class Tag extends Command {
  client: CourseClient;
  public constructor() {
    super('tag', {
      aliases: ['tag'],
      category: 'tag',
      channel: 'guild',
      ratelimit: 2
    });
  }

  public async *args(): object {
    const method = yield {
      type: [
        ['tag-show', 'show'],
        ['tag-add', 'add'],
        ['tag-delete', 'del', 'delete', 'remove', 'rm'],
        ['tag-edit', 'edit'],
        ['tag-list', 'list']
      ],
      otherwise: async (msg: Message) => {
        // @ts-ignore
        const prefix = await this.handler.prefix(msg);
        return stripIndents`
				Please check how to use this command with ${prefix}help tag
				`;
      }
    };

    return Flag.continue(method);
  }
}
