const { Command } = require('discord-akairo');
const ms = require('ms');

class Daily extends Command {
    constructor() {
        super('daily', {
            aliases: ['daily', 'daly'],
            clientPermissions: ['SEND_MESSAGES'],
            userPermissions: ['SEND_MESSAGES'],
            cooldown: ms('1d'),
            channel: 'guild',
            category: 'economy',
            description: {
                content: 'Rewards you with a amount of credits each day!',
                usage: ['daily']
            }
        });
    }

    async exec(message) {
        const embed = this.client.dailyEmbed(message.author);
        await this.client.models.Profile.findOne(
            {
                userID: message.author.id
            },
            async (err, res) => {
                if (err) console.error(err);

                if (!res) {
                    const newProfile = {
                        userID: message.author.id,
                        user: message.author.tag,
                        credits: {
                            amount: 25,
                            date: this.client.today
                        },
                        timestamp: this.client.today
                    };
                    await this.client.createProfile(newProfile);
                    return message.util.send(embed);
                } else {
                    if (res.credits.date === this.client.today) {
                        return message.reply('Please wait until tomorrow!');
                    }
                    const newMoney = res.credits.amount + 25;
                    await this.client.updateProfile(message.author, {
                        credits: { amount: newMoney, date: this.client.today }
                    });
                    return message.util.send(embed);
                }
            }
        );
    }
}

module.exports = Daily;
