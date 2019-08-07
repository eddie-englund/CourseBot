const { Command } = require('discord-akairo');

/**
 * @class setPrefix
 * @description allows user to set a new prefix for the bot in that specific guild
 * @param newPrefix @type String
 */

class SetPrefix extends Command {
    constructor() {
        super('setPrefix', {
            aliases: ['newprefix', 'setprefix'],
            clientPermissions: ['SEND_MESSAGES'],
            userPermissions: ['MANAGE_CHANNELS'],
            args: [
                {
                    id: 'newPrefix',
                    type: 'string',
                    promt: {
                        optional: false
                    }
                }
            ]
        });
    }

    async exec(message, args) {
        // Args handling
        if (!args.newPrefix) return message.reply('Please provide a prefix!');

        // Get embed from embed func
        const embed = await this.client.prefixEmbed(message.author, message.guild, args.newPrefix);

        // Try to update prefix and respond

        try {
            await this.client.updateGuild(message.guild, { prefix: args.newPrefix });
            return message.util.send(embed);
        } catch (error) {
            console.error(error);
            return message.reply(
                `Darn, looks like there was an error somewhere! Error message: ${error}. If the error is something simlilar to "data.updateOne() is not a function", please use the setup command and then try again!`
            );
        }
    }
}

module.exports = SetPrefix;
