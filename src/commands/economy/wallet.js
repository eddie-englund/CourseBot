const { Command } = require('discord-akairo');

class Wallet extends Command {
    constructor() {
        super('wallet', {
            aliases: ['credits', 'wallet', 'credit'],
            clientPermissions: ['SEND_MESSAGES'],
            channel: 'guild'
        });
    }

    async exec(message) {
        const Profile = await this.client.getProfile(message.author);
        if (!Profile) return message.reply('You don\'t have any credits!');
        const embed = this.client.util
            .embed()
            .setColor(this.client.color.main)
            .setAuthor(message.author.tag, message.author.displayAvatarURL())
            .setDescription(`Credits: ${Profile.credits.amount}💵`);
        return message.util.send(embed);
    }
}

module.exports = Wallet;
