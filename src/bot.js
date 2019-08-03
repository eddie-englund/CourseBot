const { config } = require('dotenv');
const { join } = require('path');
const {
    AkairoClient,
    CommandHandler,
    ListenerHandler
} = require('discord-akairo');
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
            cooldown: 2000,
            handleEdits: true,
            directory: join(__dirname, 'commands')
        });
        this.listenerHandler = new ListenerHandler(this, {
            directory: join(__dirname, 'listeners')
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
