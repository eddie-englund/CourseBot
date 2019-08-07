const { Listener } = require('discord-akairo');

class Message extends Listener {
    constructor() {
        super('message', {
            emitter: 'client',
            event: 'message',
            category: 'client'
        });
    }

    async exec(message) {
        if (message.author.bot) return;

        // eslint-disable-next-line no-extra-parens
        const randomMessage = Math.floor(Math.random() * 10) + 1;

        const prefix = this.handler.prefix;

        if (message.content.startsWith(prefix)) return;

        if (randomMessage >= 2 && randomMessage <= 3) {
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
                            level: {
                                xp: 25,
                                rank: 1
                            },
                            timestamp: this.client.today
                        };
                        return this.client.createProfile(newProfile);
                    } else {
                        const newXp = res.level.xp + 25;
                        await this.client.updateProfile(message.author, {
                            level: { xp: newXp }
                        });
                        if (res.level.xp === res.level.rank * 500) {
                            // eslint-disable-next-line require-atomic-updates
                            const newRank = res.level.rank + 1;
                            await this.client.updateProfile(message.author, {
                                level: { rank: newRank }
                            });

                            const rankEmbed = this.client.util
                                .embed()
                                .setColor(this.client.color.main)
                                .setAuthor(message.author.tag, message.author.displayAvatarURL())
                                .setDescription(
                                    `${message.author} has leveled to ${res.level.rank}`
                                );

                            return message.util.send(rankEmbed);
                        }
                    }
                    return undefined;
                }
            );
        }
    }
}

module.exports = Message;
