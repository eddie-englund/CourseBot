const { config } = require('dotenv');
const { join } = require('path');
const { AkairoClient, CommandHandler, ListenerHandler } = require('discord-akairo');
config();

class CourseClient extends AkairoClient {
    constructor() {
        super(
            {
                ownerID: process.env.ownerID
            },
            {
                disableEveryone: true
            }
        );

        let today = new Date();
        const dd = String(today.getDate()).padStart(2, '0');
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const yyyy = today.getFullYear();
        today = `${mm}/${dd}/${yyyy}`;

        this.today = today;
        this.mongoose = require('./util/mongoose');
        this.color = require('./util/colors');
        this.config = require('./util/config');
        this.models = require('./models/index');
        this.commandHandler = new CommandHandler(this, {
            // Per guild prefix
            prefix: async msg => {
                const setting = await client.getGuild(msg.guild);
                return setting.prefix;
            },
            blockBots: true,
            blockClient: true,
            allowMention: true,
            commandUtil: true,
            defaultCooldown: 3000,
            ignoreCooldown: [],
            handleEdits: true,
            directory: join(__dirname, 'commands'),
            prompt: {
                modifyStart: (_, str) => `${str}\n\nType \`cancel\` to cancel the command.`,
                modifyRetry: (_, str) => `${str}\n\nType \`cancel\` to cancel the command.`,
                timeout: 'Guess you took too long, the command has been cancelled.',
                ended:
                    'You\'ve tried to use this command 3 times. The command has now been canceled',
                cancel: 'The command has been cancelled.',
                retries: 3,
                time: 30000
            }
        });
        this.listenerHandler = new ListenerHandler(this, {
            directory: join(__dirname, 'listeners')
        });
        this.listenerHandler.setEmitters({
            commandHandler: this.commandHandler,
            listenerHandler: this.listenerHandler
        });
        this.commandHandler.useListenerHandler(this.ListenerHandler);
        this.listenerHandler.loadAll();
        this.commandHandler.loadAll();
    }
}

const client = new CourseClient();
require('./util/functions')(client);
require('./util/embeds')(client);

// Final steps
client.mongoose.init();
client.login(process.env.TOKEN);
