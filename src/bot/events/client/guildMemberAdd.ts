import { Listener } from 'discord-akairo';
import { GuildMember } from 'discord.js';
import { CourseClient } from '../../client/CourseClient';

export default class GuildMemberAdd extends Listener {
  public client: CourseClient;
  public constructor() {
    super('guildMemberAdd', {
      event: 'guildMemberAdd',
      emitter: 'client',
      category: 'client',
    });
  }

  public async exec(member: GuildMember) {
    try {
      return this.client.db.NewProfile(member.user);
    } catch (error) {
      console.error(error);
    }
  }
}
