import { Listener, Command } from 'discord-akairo';
import { Message } from 'discord.js';
import CourseClient from '../../client/CourseClient';
const ms = require('ms');

export default class Cooldown extends Listener {
  client: CourseClient;
  constructor() {
    super('cooldown', {
      event: 'cooldown',
      emitter: 'commandHandler',
      category: 'commandHandler'
    });
  }

  exec(message: Message, command: Command, remaning) {
    return message!.reply(
      `Please wait \`\`${ms(remaning)}\`\` before using \`\`${command}\`\``
    );
  }
}
