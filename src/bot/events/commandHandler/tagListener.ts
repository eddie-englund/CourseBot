import { Listener } from 'discord-akairo';
import { Message } from 'discord.js';
import { CourseClient } from '../../client/CourseClient';

export default class TagListener extends Listener {
  public client: CourseClient;
  public constructor() {
    super('tag-listener', {
      emitter: 'commandHandler',
      event: 'messageInvalid',
      category: 'commandHandler',
    });
  }

  public async exec(message: Message) {
    if (message.guild && message.util!.parsed.prefix) {
      if (!message.util!.parsed!.alias || !message.util!.parsed!.afterPrefix) return;
      const command = this.client.commandHandler.modules.get('tag-show');
      return this.client.commandHandler.runCommand(
        message,
        command!,
        await command!.parse(message, message.util!.parsed!.afterPrefix)
      );
    }
  }
}
