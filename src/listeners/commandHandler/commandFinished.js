const { Listener } = require('discord-akairo');

class CommandFinished extends Listener {
    constructor() {
        super('commandFinished', {
            event: 'commandFinished',
            emitter: 'commandHandler',
            category: 'commandHandler'
        });
    }

    async exec(message, command) {
        await this.client.models.Client.findOne(
            {
                client: 'Course'
            },
            (err, res) => {
                if (err) console.error(err);
                if (!res) {
                    const newClient = new this.client.models.Client({
                        client: this.client.user.username,
                        commandsFinished: 1,
                        lastCommand: command.id
                    });
                    return newClient.save().catch(e => console.error(e));
                } else {
                    res.commandsFinished += 1;
                    res.lastCommand = command.id;
                    return res.save().catch(e => console.error(e));
                }
            }
        );
    }
}

module.exports = CommandFinished;
