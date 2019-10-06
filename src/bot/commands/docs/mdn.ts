import { Command } from 'discord-akairo';
import { Message, MessageEmbed } from 'discord.js';
import fetch from 'node-fetch';
import * as qs from 'querystring';
import { CourseClient } from 'src/bot/client/CourseClient';

export default class MDNCommand extends Command {
  public client: CourseClient;
  public constructor() {
    super('mdn', {
      aliases: ['mdn', 'mozilla-developer-network'],
      category: 'docs',
      description: {
        content: 'Searches MDN for your query.',
        usage: '<query>',
        examples: ['Map', 'Map#get', 'Map.set'],
      },
      regex: /^(?:mdn,) (.+)/i,
      clientPermissions: ['EMBED_LINKS'],
      args: [
        {
          id: 'query',
          prompt: {
            start: (message: Message): string => `${message.author}, what would you like to search for?`,
          },
          match: 'content',
          type: (_, query): string | null => (query ? query.replace(/#/g, '.prototype.') : null),
        },
      ],
    });
  }

  public async exec(
    message: Message,
    { query, match }: { query: string; match: any }
  ): Promise<Message | Message[]> {
    if (!query && match) query = match[1];
    const queryString = qs.stringify({ q: query });
    const res = await fetch(`https://developer.mozilla.org/en-US/search.json?locale=en-US&q=${queryString}`);
    const body = await res.json();
    if (body.documents.length === 0) {
      return message.util!.reply("Couldn't find the requested information.");
    }

    const embed = new MessageEmbed()
      .setColor(this.client.color.main)
      .setAuthor('MDN', 'https://developer.mozilla.org/static/img/favicon32.7f3da72dcea1.png', 'https://developer.mozilla.org/')
      .setURL(body.documents[0].url)
      .setTitle(body.documents[0].title)
      .setDescription(body.documents[0].excerpt.replace(/\<mark\>|\<\/mark\>/g, "**"));

    return message.util!.send(embed);
  }
}
