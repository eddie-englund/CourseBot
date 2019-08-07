const { Listener } = require('discord-akairo');

class GuildCreate extends Listener {
    constructor() {
        super('guildCreate', {
            emitter: 'client',
            event: 'guildCreate'
        });
    }

    async exec(guild) {
        try {
            const newGuild = {
                guildID: guild.id,
                guildName: guild.name
            };
            await this.client.createGuild(newGuild);
        } catch (error) {
            console.error(error);
        }
    }
}

module.exports = GuildCreate;
