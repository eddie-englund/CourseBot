import { Listener, Command } from 'discord-akairo';
import { CourseClient } from '../../client/CourseClient';
import { Message } from 'discord.js';

export default class MissingPermissions extends Listener {
  public client: CourseClient;

  public constructor() {
    super('missingPermissions', {
      emitter: 'commandHandler',
      category: 'commandHandler',
      event: 'missingPermissions',
    });
  }

  public async exec(message: Message, command: Command, type: String, missing) {
    switch (type) {
      case 'client':
        this.client.logger.info(
          `Missing the permission: ${missing}, in guild "${message.guild.name}" id: ${message.guild.id}`
        );
        message.util!.send(
          `It seems like I am missing the permission \`\`${missing}\`\` and because of that I can execute the command \`\`${command}\`\``
        );
        break;
      case 'user':
        message.reply(
          `Sorry can't let you use the command \`\`${command}\`\`. You're missing the permission \`\`${missing}\`\`.`
        );
        break;
    }
  }
}
