const { Command } = require('discord-akairo');
const fetch = require('node-fetch');
const qs = require('query-string');
const Turndown = require('turndown');

class MDN extends Command {
    constructor() {
        super('mdn', {
            aliases: ['mdn', 'jsdocs'],
            clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
            ratelimit: 2,
            args: [
                {
                    id: 'searchQuery',
                    match: 'content',
                    prompt: {
                        optional: false,
                        start: message => `${message.author}, what would you like to search for?`,
                        retry: message => `${message.author}, please try again!`
                    }
                }
            ]
        });
    }

    async exec(message, args) {
        const queryString = qs.stringify({ q: args.searchQuery });
        const res = await fetch(`https://mdn.pleb.xyz/search?${queryString}`);
        const body = await res.json();
        if (!body.URL || !body.Title || !body.Summary) {
            return message.util.reply(
                `Cant find: ${args.searchQuery}, try looking for something real next time...`
            );
        }
        const summary = body.Summary.replace(
            /<code><strong>(.+)<\/strong><\/code>/g,
            '<strong><code>$1</code></strong>'
        );

        const turndown = new Turndown();
        turndown.addRule('hyperlink', {
            filter: 'a',
            replacement: (text, node) => `[${text}](https://developer.mozilla.org${node.href})`
        });

        const embed = this.client.util
            .embed()
            .setColor(this.client.color.main)
            .setAuthor('MDN', 'https://i.imgur.com/DFGXabG.png', 'https://developer.mozilla.org/')
            .setURL(`https://developer.mozilla.org${body.URL}`)
            .setTitle(body.Title)
            .setDescription(turndown.turndown(summary));

        return message.util.send(embed);
    }
}

module.exports = MDN;
