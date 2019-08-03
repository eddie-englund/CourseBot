const { Command } = require('discord-akairo');

class Daily extends Command {
    constructor() {
        super('daily', {
            aliases: ['daily', 'daly'],
            clientPermissions: ['SEND_MESSAGES'],
            userPermissions: ['SEND_MESSAGES'],
            channel: 'guild',
            category: 'economy'
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
                            amount: 100,
                            date: this.client.today
                        },
                        date: this.client.today
                    };
                    await this.client.createProfile(newProfile);
                    return message.util.send(embed);
                } else {
                    const newMoney = res.credits.amount + 100;
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
