const { Command } = require('discord-akairo');

class Setup extends Command {
    constructor() {
        super('setup', {
            aliases: ['init', 'setup'],
            category: 'settings',
            channel: 'guild',
            clientPermissions: ['SEND_MESSAGES'],
            userPermissions: ['MANAGE_CHANNELS']
        });
    }

    async exec(message) {
        // eslint-disable-next-line new-cap
        await this.client.models.Guild.findOne(
            {
                guildID: message.guild.id
            },
            (err, res) => {
                if (err) this.client.logger.error({ event: 'error' }`${err}`);
                if (!res) {
                    return this.guildExec(message);
                } else {
                    return message.reply('This guild already has a db instance.');
                }
            }
        );
    }

    async guildExec(message) {
        try {
            await this.client.emit('guildCreate', message.guild);
            return message.reply('Guild initated!');
        } catch (e) {
            return message.reply(`Error: ${e.message}`);
        }
    }
}

module.exports = Setup;
