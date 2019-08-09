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
            ratelimit: 2,
            args: [
                {
                    id: 'newPrefix',
                    type: 'string',
                    prompt: {
                        optional: false,
                        start: message => `${message.author}, What prefix would you like to set?`,
                        retry: message =>
                            `${message.author}, it has to be a string! Numbers are not valid!`
                    }
                }
            ]
        });
    }

    async exec(message, args) {
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
