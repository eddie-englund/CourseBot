import { Command, Flag } from 'discord-akairo';
import { CourseClient } from '../../client/CourseClient';
import { Message } from 'discord.js';
import { stripIndents } from 'common-tags';

export default class Frameworks extends Command {
  public client: CourseClient;
  constructor() {
    super('documentation', {
      aliases: ['frameworks', 'docs'],
      category: 'docs',
      clientPermissions: ['SEND_MESSAGES'],
      description: {
        content: 'Sends links to framework docs.',
        usage: '<framework>',
        examples: ['vue', 'react', 'svelte', 'electron', 'angular', 'discord.js', 'discordjs'],
      },
    });
  }

  public *args(): object {
    const method = yield {
      type: [['djs-docs', 'djs'], ['akairo-docs', 'akairo'], ['mdn'], ['npm']],
      otherwise: (msg: Message): string => {
        // @ts-ignore
        const prefix = this.handler.prefix(msg);
        return stripIndents`
        No can do!
        use ${prefix}help docs to get more info
				`;
      },
    };

    return Flag.continue(method);
  }
}
