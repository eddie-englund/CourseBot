const { Command } = require('discord-akairo');

class RankCommand extends Command {
    constructor() {
        super('RankCommand', {
            aliases: ['rank', 'level'],
            clientPermissions: ['SEND_MESSAGES'],
            channel: 'guild',
            category: 'social',
            ratelimit: 2,
            args: [
                {
                    id: 'member',
                    type: 'member',
                    default: message => message.member
                }
            ]
        });
    }

    async exec(message, args) {
        const Profile = await this.client.getProfile(args.member);
        if (!Profile) return message.reply('You have not gained any xp yet!');
        const rankEmbed = this.client.util
            .embed()
            .setColor(this.client.color.main)
            .setAuthor(args.member.user.tag, args.member.user.displayAvatarURL())
            .setDescription([
                `Your current xp is: \`\`${Profile.level.xp}\`\``,
                `Your current rank is \`\`${Profile.level.rank}\`\``
            ]);
        return message.util.send(rankEmbed);
    }
}

module.exports = RankCommand;
