import { Listener, Command } from 'discord-akairo';
import { CourseClient } from '../../client/CourseClient';
import { Message } from 'discord.js';

export class MissingPermissions extends Listener {
  client: CourseClient;

  constructor() {
    super('missingPermissions', {
      emitter: 'commandHandler',
      category: 'commandHandler',
      event: 'missingPermissions',
    });
  }

  public async exec(message: Message, command: Command, type: String, missing) {
    switch (type) {
      case 'client':
        message.util!.send(
          `It seems like I am missing the permission \`\`${missing}\`\` and because of that I can execute the command \`\`${command}\`\``
        );
        break;
      case 'user':
        message.reply(
          `Sorry can't let you do that. You're missing the permission \`\`${missing}\`\`.`
        );
        break;
      default:
        console.error(`Something went wrong with the missingPermissions Listener`);
    }
  }
}
