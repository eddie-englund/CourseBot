import { Listener } from 'discord-akairo';
import { CourseClient } from '../../client/CourseClient';
import { Guild } from 'discord.js';

export default class Ready extends Listener {
  public client: CourseClient;
  constructor() {
    super('ready', {
      event: 'ready',
      emitter: 'client',
      category: 'client',
    });
  }

  public async exec() {
    await this.client.guilds.forEach(async (guild: Guild) => {
      try {
        await this.client.db.GetGuild(guild);
      } catch (error) {
        return this.client.db
          .CreateGuild(guild)
          .then(g =>
            this.client.logger.info(`Created db instance at ready event for guild: ${g.guild}, id: ${g.guildID}`)
          );
      }
    });

    this.client.user.setActivity(`Watching ${this.client.guilds.size} guilds!`, {
      type: 'WATCHING',
    });
    return this.client.logger.info(`Client connected to the discord API`);
  }
}

module.exports = Ready;
