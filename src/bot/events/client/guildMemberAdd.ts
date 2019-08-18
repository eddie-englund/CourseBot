import { Listener } from 'discord-akairo';
import { GuildMember } from 'discord.js';
import { CourseClient } from '../../client/CourseClient';

export class GuildMemberAdd extends Listener {
  client: CourseClient;
  constructor() {
    super('guildMemberAdd', {
      event: 'guildMemberAdd',
      emitter: 'client',
      category: 'client',
    });
  }

  async exec(member: GuildMember) {
    const user = member.user;
    try {
      const newProfile: Object = {
        user: user.tag,
        userID: user.id,
      };
      return this.client.createProfile(newProfile);
    } catch (error) {
      console.error(error);
    }
  }
}
