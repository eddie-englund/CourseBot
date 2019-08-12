import { Listener } from 'discord-akairo';
import CourseClient from 'src/bot/client/CourseClient';

export default class CommandStarted extends Listener {
  client: CourseClient;

  constructor() {
    super('commandStarted', {
      emitter: 'commandHandler',
      category: 'commandHandler',
      event: 'commandFinished'
    });
  }

  public async exec(message) {
    const res = await this.client.getGuild(message.guild);
    if (!res) return;
    const newStarted = res.guildLog.commands.started + 1;
    return this.client.updateGuild(message.guild, {
      guildLog: { commands: { started: newStarted } }
    });
  }
}
