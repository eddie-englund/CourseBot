const { Listener } = require('discord-akairo');

class GuildMemberAdd extends Listener {
    constructor() {
        super('guildMemberAdd', {
            emitter: 'client',
            event: 'guildMemberAdd'
        });
    }

    exec(member) {
        try {
            const user = {
                user: member.tag,
                userID: member.id,
                guildID: [member.guild.id]
            };
            return this.client.createProfile(user);
        } catch (e) {
            return console.error(e);
        }
    }
}

module.exports = GuildMemberAdd;
