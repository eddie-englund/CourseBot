import { Listener } from 'discord-akairo';

class Ready extends Listener {
    constructor() {
        super('ready', {
            event: 'ready',
            emitter: 'client',
            category: 'client'
        });
    }

    public exec() {
        this.client.user.setActivity('you', { type: 'WATCHING' });
        console.log(`${this.client.user.username} has connected to the api`);
    }
}

module.exports = Ready;
