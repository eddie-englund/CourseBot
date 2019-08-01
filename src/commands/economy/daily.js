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
        let today = new Date();
        const dd = String(today.getDate()).padStart(2, '0');
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const yyyy = today.getFullYear();
        today = `${mm}/${dd}/${yyyy}`;

        const Profile = await this.client.getProfile(message.author);
        if (!Profile) {
            await this.client.createProfile(this.client.newUser(message.author)).then(
                await this.client
                    .updateProfile(message.author, {
                        credits: {
                            amount: 100,
                            date: Date()
                        }
                    })
                    .then(message.util.send(this.client.dailyEmbed(message.author)))
            );
        } else if (Profile.credits.date.includes(today)) {
            return message.reply('You\'ve already recived your daily! Come back tommorow!');
        } else {
            const newAmount = Profile.credits.amount + 100;
            await this.client.updateProfile(message.author, {
                credits: { amount: newAmount, date: today }
            });
            return message.util.send(this.client.dailyEmbed(message.author));
        }
        return undefined;
    }
}

module.exports = Daily;
