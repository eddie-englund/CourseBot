const { Listener } = require('discord-akairo');

class Disconnected extends Listener {
    constructor() {
        super('disconnect', {
            event: 'disconnect',
            emitter: 'client'
        });
    }

    exec() {
        console.log('Bot has disconnected...');
    }
}

module.exports = Disconnected;
