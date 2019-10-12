import { Listener } from 'discord-akairo';
import { Guild } from 'discord.js';
import { CourseClient } from '../../client/CourseClient';
import { IGuild } from '../../../db/models/Guild';

export default class GuildCreate extends Listener {
  public client: CourseClient;
  constructor() {
    super('guildCreate', {
      event: 'guildCreate',
      emitter: 'client',
      category: 'client',
    });
  }

  public async exec(guild: Guild): Promise<IGuild> {
    this.client.logger.info(`Created db instance for guild: ${guild.name} (${guild.id})`);
    const data = await this.client.db.GetGuild(guild);
    if (data) return;

    return this.client.db.CreateGuild(guild);
  }
}
