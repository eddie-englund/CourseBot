const { Command } = require('discord-akairo');
const ms = require('ms');

class ReputationCommand extends Command {
    constructor() {
        super('rep', {
            aliases: ['rep'],
            clientPermissions: ['SEND_MESSAGES'],
            userPermissions: ['SEND_MESSAGES'],
            channel: 'guild',
            category: 'social',
            cooldown: ms('1d'),
            ratelimit: 2,
            description: {
                content: 'Adds a reputation point to another user',
                usage: ['rep <@user>']
            },
            args: [
                {
                    id: 'member',
                    type: 'member',
                    prompt: {
                        retry: 'Invalid member! Please try again.',
                        limit: 3,
                        optional: false
                    }
                }
            ]
        });
    }

    async exec(message, args) {
        if (!args.member) return message.reply('You must provide a valid user!');
        if (args.member.user.bot) return `You can't rep user: ${args.member} because it's a bot!`;
        const today = new Date();
        const Profile = {
            userID: args.member.id,
            user: args.member.user.tag,
            reps: [
                {
                    userID: message.author.id,
                    user: message.author.tag,
                    date: today
                }
            ]
        };

        function createProfile(client) {
            return client.createProfile(Profile);
        }

        await this.client.models.Profile.findOne(
            {
                userID: args.member.id
            },
            async (err, res) => {
                if (err) console.error(err);
                if (!res) {
                    await createProfile(this.client);
                    return message.util.send(
                        `${message.author}, has given ${args.member.user} a reputation point!`
                    );
                } else {
                    await this.client.updateProfile(args.member.user, {
                        reps: [
                            {
                                user: message.author.tag,
                                userID: message.author.id,
                                date: today
                            }
                        ]
                    });
                    return message.util.send(
                        `${message.author}, has given ${args.member.user} a reputation point!`
                    );
                }
            }
        );
        return undefined;
    }
}

module.exports = ReputationCommand;
