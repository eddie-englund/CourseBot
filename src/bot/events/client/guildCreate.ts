import { Listener } from 'discord-akairo';
import { Guild } from 'discord.js';
import { CourseClient } from '../../client/CourseClient';

export class GuildCreate extends Listener {
  public client: CourseClient;
  constructor() {
    super('guildCreate', {
      event: 'guildCreate',
      emitter: 'client',
      category: 'client',
    });
  }

  async exec(guild: Guild) {
    const data = await this.client.getGuild(guild);
    if (data) return;
    const newGuild: Object = {
      guild: guild.name,
      guildID: guild.id,
    };

    return this.client.createGuild(newGuild);
  }
}
