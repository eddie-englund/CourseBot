const { Command } = require('discord-akairo');

class EvalComand extends Command {
    constructor() {
        super('eval', {
            aliases: ['eval'],
            ownerOnly: true,
            args: [
                {
                    id: 'code',
                    match: 'content'
                }
            ]
        });
    }

    exec(message, args) {
        try {
            const code = args.code;
            let evaled = eval(code);

            if (typeof evaled !== 'string') evaled = require('util').inspect(evaled);

            message.channel.send(this.client.clean(evaled), { code: 'js' });
        } catch (err) {
            message.channel.send(`\`ERROR\` \`\`\`xl\n${this.client.clean(err)}\n\`\`\``);
        }
    }
}

module.exports = EvalComand;
