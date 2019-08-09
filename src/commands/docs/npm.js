const { Command } = require('discord-akairo');
const fetch = require('node-fetch');
const moment = require('moment');
require('moment-duration-format');

class NPM extends Command {
    constructor() {
        super('npm', {
            aliases: ['npm', 'nodepackagemanager', 'searchnpm'],
            clientPermissions: ['EMBED_LINKS', 'SEND_MESSAGES'],
            userPermissions: ['SEND_MESSAGES'],
            channel: 'guild',
            ratelimit: 2,
            args: [
                {
                    id: 'searchQuery',
                    match: 'content',
                    prompt: {
                        optional: false,
                        start: message =>
                            `${message.author}, what npm library do you want to look for?`,
                        retry: message => `${message.author}, please try again!`
                    }
                }
            ]
        });
    }

    async exec(message, args) {
        const res = await fetch(`https://registry.npmjs.com/${args.searchQuery}`, {
            method: 'GET'
        });
        if (res.status === 404) {
            return message.util.reply(
                'Couldn\'t find the requested package. Make sure it\'s a thing...'
            );
        }
        const body = await res.json();
        if (body.error === 'error') {
            return message.reply(`Npm returned an error! Error: \`\`${body.error}\`\``);
        }
        try {
            const version = body.versions[body['dist-tags'].latest];
            const maintainers = this._trimArray(body.maintainers.map(user => user.name));
            const dependencies = version.dependencies
                ? this._trimArray(Object.keys(version.dependencies))
                : null;
            const embed = this.client.util
                .embed()
                .setColor(this.client.color.main)
                .setAuthor('NPM', 'https://i.imgur.com/ErKf5Y0.png', 'https://www.npmjs.com/')
                .setTitle(body.name)
                .setURL(`https://www.npmjs.com/package/${args.searchQuery}`)
                .setDescription(body.description || 'No description.')
                .addField('❯ Version', body['dist-tags'].latest, true)
                .addField('❯ License', body.license || 'None', true)
                .addField('❯ Author', body.author ? body.author.name : '???', true)
                .addField(
                    '❯ Creation Date',
                    moment.utc(body.time.created).format('YYYY/MM/DD hh:mm:ss'),
                    true
                )
                .addField(
                    '❯ Modification Date',
                    moment.utc(body.time.modified).format('YYYY/MM/DD hh:mm:ss'),
                    true
                )
                .addField('❯ Main File', version.main || 'index.js', true)
                .addField(
                    '❯ Dependencies',
                    dependencies && dependencies.length ? dependencies.join(', ') : 'None'
                )
                .addField('❯ Maintainers', maintainers.join(', '));

            return message.util.send(embed);
        } catch (error) {
            console.error(error);
            return message.reply('Try looking for something that exists...');
        }
    }

    _trimArray(arr) {
        if (arr.length > 10) {
            const len = arr.length - 10;
            arr = arr.slice(0, 10);
            arr.push(`${len} more...`);
        }

        return arr;
    }
}

module.exports = NPM;
