import { Listener } from 'discord-akairo';

class Ready extends Listener {
  constructor() {
    super('ready', {
      event: 'ready',
      emitter: 'client',
      category: 'client'
    });
  }

  exec() {
    this.client.user.setActivity('you', { type: 'WATCHING' });
    console.log('DongClient has connected');
  }
}

module.exports = Ready;
