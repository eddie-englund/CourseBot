import { Listener } from 'discord-akairo';
import { Guild } from 'discord.js';
import DongClient from 'src/bot/client/CourseClient';

export default class GuildCreate extends Listener {
  client: DongClient;
  constructor() {
    super('guildCreate', {
      event: 'guildCreate',
      emitter: 'client',
      category: 'client'
    });
  }

  async exec(guild: Guild) {
    const newGuild: Object = {
      guild: guild.name,
      guildID: guild.id
    };

    return this.client.createGuild(newGuild);
  }
}
