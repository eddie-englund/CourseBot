import { Listener, Command } from 'discord-akairo';
import { Message } from 'discord.js';
import { CourseClient } from '../../client/CourseClient';
import ms = require('ms');

export default class Cooldown extends Listener {
  public client: CourseClient;
  constructor() {
    super('cooldown', {
      event: 'cooldown',
      emitter: 'commandHandler',
      category: 'commandHandler',
    });
  }

  public exec(message: Message, command: Command, remaning) {
    return message!.reply(`Please wait \`\`${ms(remaning)}\`\` before using the command \`\`${command}\`\``);
  }
}
