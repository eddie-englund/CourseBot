const { Command } = require('discord-akairo');

class Docs extends Command {
    constructor() {
        super('frameworks', {
            aliases: ['docs', 'framework'],
            clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
            ratelimit: 2,
            args: [
                {
                    id: 'framework',
                    match: 'content',
                    prompt: {
                        optional: false,
                        start: message => `${message.author}, what framework?`,
                        retry: message => `${message.author}, please try again!`
                    }
                }
            ]
        });
    }

    exec(message, args) {
        console.log('here');
        switch (args.framework) {
        case 'vue':
            message.channel.send('https://vuejs.org/v2/guide/');
            break;
        case 'discord.js':
            message.util.send('https://discord.js.org/#');
            break;
        case 'discord-akairo':
            message.util.send('https://discord-akairo.github.io/#/');
            break;
        case 'react':
            message.util.send('https://reactjs.org/docs/getting-started.html');
            break;
        case 'svelte':
            message.util.send('https://svelte.dev/');
        }
    }
}

module.exports = Docs;
