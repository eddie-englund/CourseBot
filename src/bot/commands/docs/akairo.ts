import { Command } from 'discord-akairo';
import { Message } from 'discord.js';
import fetch from 'node-fetch';
import * as qs from 'querystring';

const SOURCES = ['akairo', 'akairo-master'];

export default class AkairoCommand extends Command {
  public constructor() {
    super('akairo-docs', {
      aliases: ['discord-akairo', 'akairo'],
      channel: 'guild',
      description: {
        content: 'Searches the discord akairo documentation.',
        usage: '<query> <branch>',
        examples: ['CommandHander', 'CommandHandler#prefix', 'Flag akairo-master'],
      },
      category: 'docs',
      clientPermissions: ['EMBED_LINKS'],
      ratelimit: 2,
      flags: ['--force', '-f'],
      optionFlags: ['--default='],
    });
  }

  public *args(): object {
    const defaultDocs = yield {
      match: 'option',
      flag: '--default=',
      default: 'akairo',
    };

    const force = yield {
      match: 'flag',
      flag: ['--force', '-f'],
    };

    const query = yield {
      match: 'rest',
      type: 'lowercase',
      prompt: {
        start: (message: Message): string => `${message.author}, what would you like to search?`,
        optional: defaultDocs ? true : false,
      },
    };

    return { defaultDocs, force, query };
  }

  public async exec(
    message: Message,
    { query, force }: { defaultDocs: string; query: string; force: boolean }
  ): Promise<Message | Message[]> {
    console.log(query);
    let q = query.split(' ');
    const docs = 'akairo';
    let source = SOURCES.includes(q.slice(-1)[0]) ? q.pop() : docs;
    if (source === '11.5-dev') {
      source = `https://raw.githubusercontent.com/discordjs/discord.js/docs/${source}.json`;
    }
    const queryString = qs.stringify({ src: source, q: q.join(' '), force });
    const res = await fetch(`https://djsdocs.sorta.moe/v2/embed?${queryString}`);
    const embed = await res.json();
    if (!embed) {
      return message.util!.reply("Couldn't find that!");
    }
    return message.util!.send({ embed });
  }
}
