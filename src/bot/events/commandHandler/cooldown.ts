import { Listener, Command } from 'discord-akairo';
import { Message } from 'discord.js';
import { CourseClient } from '../../client/CourseClient';
import ms = require('ms');

export class Cooldown extends Listener {
  public client: CourseClient;
  constructor() {
    super('cooldown', {
      event: 'cooldown',
      emitter: 'commandHandler',
      category: 'commandHandler',
    });
  }

  exec(message: Message, command: Command, remaning) {
    return message!.reply(`Please wait \`\`${ms(remaning)}\`\` before using \`\`${command}\`\``);
  }
}
