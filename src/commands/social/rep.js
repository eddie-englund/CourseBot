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
                        start: message => `${message.author}, Please mention a valid user!`,
                        retry: message =>
                            `${message.author}, invalid member provided! Please try again.`,
                        optional: false
                    }
                }
            ]
        });
    }

    async exec(message, args) {
        if (!args.member) return message.reply('You must provide a valid user!');
        if (args.member.user.bot) return `You can't rep user: ${args.member} because it's a bot!`;

        const Profile = {
            userID: args.member.id,
            user: args.member.user.tag,
            reps: [
                {
                    userID: message.author.id,
                    user: message.author.tag,
                    date: this.client.today
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
                                date: this.client.today
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
