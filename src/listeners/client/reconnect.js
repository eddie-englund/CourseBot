const { Listener } = require('discord-akairo');

class ReconnectListner extends Listener {
    constructor() {
        super('reconnect', {
            event: 'reconnect',
            emitter: 'client'
        });
    }

    exec() {
        console.log('Reconnecting....');
    }
}

module.exports = ReconnectListner;
