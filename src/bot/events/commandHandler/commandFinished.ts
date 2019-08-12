import { Listener } from 'discord-akairo';
import CourseClient from 'src/bot/client/CourseClient';

export default class CommandsFinished extends Listener {
  client: CourseClient;

  constructor() {
    super('commandFinished', {
      emitter: 'commandHandler',
      category: 'commandHandler',
      event: 'commandFinished'
    });
  }

  public async exec(message) {
    const res = await this.client.getGuild(message.guild);
    if (!res) return;
    const newFinished = res.guildLog.commands.finished + 1;
    return this.client.updateGuild(message.guild, {
      guildLog: { commands: { finished: newFinished } }
    });
  }
}
