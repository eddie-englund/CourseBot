import { Command } from 'discord-akairo';
import { Message } from 'discord.js';
import { CourseClient } from '../../client/CourseClient';

export default class Test extends Command {
  public client: CourseClient;

  public constructor() {
    super('test', {
      aliases: ['test'],
    });
  }

  public async exec(message: Message) {
    return this.client.db.NewCase(message, 'ban', message.author, 'test');
  }
}
