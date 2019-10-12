import { Command } from 'discord-akairo';
import { Message } from 'discord.js';
import { CourseClient } from 'src/bot/client/CourseClient';

export default class Test extends Command {
  public client: CourseClient;

  public constructor() {
    super('test', {
      aliases: ['test'],
    });
  }

  public async exec(message: Message) {
    const data = await this.client.db.GetGuild(message.guild);
    if (!data) return message.util!.reply('OWO SOMETHING WHEN WRONGU');
    console.log(data);
    return message.util!.send('owo');
  }
}
