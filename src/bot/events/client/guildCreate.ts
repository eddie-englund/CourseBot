import { Listener } from 'discord-akairo';
import { Guild } from 'discord.js';
import { CourseClient } from '../../client/CourseClient';

export default class GuildCreate extends Listener {
  public client: CourseClient;
  constructor() {
    super('guildCreate', {
      event: 'guildCreate',
      emitter: 'client',
      category: 'client',
    });
  }

  public async exec(guild: Guild) {
    this.client.logger.info(`Created db instance for guild: ${guild.name} (${guild.id})`);
    const data = await this.client.getGuild(guild);
    if (data) return;
    const newGuild: { guild; guildID } = {
      guild: guild.name,
      guildID: guild.id,
    };

    return this.client.createGuild(newGuild);
  }
}
