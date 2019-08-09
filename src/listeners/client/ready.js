const { Listener } = require('discord-akairo');

class ReadyEvent extends Listener {
    constructor() {
        super('ready', {
            emitter: 'client',
            event: 'ready'
        });
    }

    exec() {
        this.client.user.setActivity('@Course', { type: 'LISTENING' });
        // eslint-disable-next-line no-console
        console.log('CourseBot has connected');
    }
}

module.exports = ReadyEvent;
