import { Listener } from 'discord-akairo';
import { CourseClient } from '../../client/CourseClient';
import { Schema } from 'mongoose';
import { Guild } from 'discord.js';
import { TOPICS, EVENTS } from '../../util/logger';

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
      const data = await this.client.getGuild(guild);
      if (!data) {
        const newGuild: Schema = {
          guildID: guild.id,
          guild: guild.name,
        };
        return this.client
          .createGuild(newGuild)
          .then(g =>
            console.log(`Created db instance at ready event for guild: ${g.guild}, id: ${g.guildID}`)
          );
      }
    });

    this.client.user.setActivity('you', { type: 'WATCHING' });
    return this.client.logger.info(`Client connected to the discord API`, {
      topic: TOPICS.DISCORD,
      event: EVENTS.READY,
    });
  }
}

module.exports = Ready;
