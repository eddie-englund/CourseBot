const { Command } = require('discord-akairo');

class CommandCount extends Command {
    constructor() {
        super('command count', {
            aliases: ['counter', 'commandcounts', 'botstats'],
            clientPermissions: ['SEND_MESSAGES'],
            channel: 'guild',
            category: 'misc',
            description: {
                content: 'Shows the amount of finished commands that has been executed!'
            }
        });
    }

    async exec(message) {
        await this.client.models.Client.findOne(
            {
                client: this.client.user.username
            },
            (err, res) => {
                if (err) console.error(err);
                if (!res) return message.reply('hmm, seems like somethings wrong :/');

                const embed = this.client.util
                    .embed()
                    .setColor(this.client.color.main)
                    .setAuthor(message.author.tag, message.author.displayAvatarURL())
                    .setDescription([
                        `${this.client.user.username} has successfully executed \`\`${res.commandsFinished}\`\` commands!`,
                        '',
                        `Last command executed: \`\`${res.lastCommand}\`\``
                    ])
                    .setTimestamp(this.client.today);
                return message.util.send(embed);
            }
        );
    }
}

module.exports = CommandCount;
