import { Listener } from 'discord-akairo';
import DongClient from 'src/bot/client/DongClient';
import { GuildMember } from 'discord.js';

export default class GuildMemberAdd extends Listener {
  client: DongClient;
  constructor() {
    super('guildMemberAdd', {
      event: 'guildMemberAdd',
      emitter: 'client',
      category: 'client'
    });
  }

  async exec(member: GuildMember) {
    const user = member.user;
    try {
      const newProfile: Object = {
        user: user.tag,
        userID: user.id
      };
      return this.client.createProfile(newProfile);
    } catch (error) {
      console.error(error);
    }
  }
}
