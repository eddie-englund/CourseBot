import { Listener } from 'discord-akairo';
import CourseClient from 'src/bot/client/CourseClient';

export default class CommandCanceled extends Listener {
  client: CourseClient;

  constructor() {
    super('commandCanceled', {
      event: 'commandCanceled',
      emitter: 'commandHandler',
      category: 'commandHandler'
    });
  }

  public async exec(message) {
    const res = await this.client.getGuild(message.guild);
    if (!res) return;
    const newCanceled = res.guildLog.commands.canceled + 1;
    return this.client.updateGuild(message.guild, {
      guildLog: { commands: { canceled: newCanceled } }
    });
  }
}
