const { Command } = require('discord-akairo');

class FormatCommand extends Command {
    constructor() {
        super('format', {
            aliases: ['format'],
            channel: 'guild',
            category: 'misc',
            description: {
                content: 'returns a guideline on how to ask for help with code issues'
            }
        });
    }

    exec(message) {
        const format
            = 'TO GET HELP PLEASE USE THIS FORMAT: \nERROR: (https://paste.menudocs.org/ link \nCODE: (https://paste.menudocs.org/ link)\nRemember to use a bin if your code is any longer than 10 lines.';
        message.util.send(format);
    }
}

module.exports = FormatCommand;
