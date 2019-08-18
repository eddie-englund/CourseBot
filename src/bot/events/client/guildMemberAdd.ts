import { Listener } from 'discord-akairo';
import { GuildMember } from 'discord.js';
import { CourseClient } from '../../client/CourseClient';

export class GuildMemberAdd extends Listener {
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
      const newProfile: { user; userID } = {
        user: member.user.tag,
        userID: member.user.id,
      };
      return this.client.createProfile(newProfile);
    } catch (error) {
      console.error(error);
    }
  }
}
