const { Command } = require('discord-akairo');

class ReputationCommand extends Command {
    constructor() {
        super('rep', {
            aliases: ['rep'],
            clientPermissions: ['SEND_MESSAGES'],
            userPermissions: ['SEND_MESSAGES'],
            channel: 'guild',
            category: 'social',
            description: {
                content: 'Adds a reputation point to another user'
            },
            args: [
                {
                    id: 'member',
                    type: 'member',
                    optional: false
                }
            ]
        });
    }

    async exec(message, args) {
        if (!args.member) return message.reply('You must provide a valid user!');

        const today = new Date();

        const Profile = this.client.getProfile(args.member.user);
        if (!Profile) {
            await this.client.createProfile(args.member.user).then(
                await this.client.updateProfile(args.member.user, {
                    reps: { userID: message.author.id, user: message.author.tag, date: today }
                }),
                message.util.send(this.client.embeds.rep(args.member.user, message.author))
            );
        } else {
            await this.client.updateProfile(Profile, {
                reps: { userID: message.author.id, user: message.author.tag, date: today }
            });
            return message.util.send(this.client.embeds.rep(args.member.user, message.author));
        }
        return undefined;
    }
}

module.exports = ReputationCommand;
