import { Command, Flag } from 'discord-akairo';
import { CourseClient } from 'src/bot/client/CourseClient';
import { Message } from 'discord.js';
import { stripIndents } from 'common-tags';
import { REPL_MODE_SLOPPY } from 'repl';

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
					When you beg me so much I just can't not help you~
					Check \`${prefix}help tag\` for more information.
					Hmph, you probably wanted to use \`${prefix}tag show\` or something!
				`;
      },
    };

    return Flag.continue(method);
  }
}
