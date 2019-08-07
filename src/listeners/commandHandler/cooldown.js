const { Listener } = require('discord-akairo');
const ms = require('ms');

class Cooldown extends Listener {
    constructor() {
        super('cooldown', {
            emitter: 'commandHandler',
            event: 'cooldown',
            category: 'commandHandler'
        });
    }

    exec(message, command, remaining) {
        const seconds = ms(remaining);
        message.reply(`please wait \`\`${seconds}\`\` before using the command \`\`${command}\`\``);
    }
}

module.exports = Cooldown;
