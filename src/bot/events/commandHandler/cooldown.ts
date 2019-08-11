import { Listener, Command } from 'discord-akairo';
import DongClient from 'src/bot/client/DongClient';
import { Message } from 'discord.js';
const ms = require('ms');

export default class Cooldown extends Listener {
  client: DongClient;
  constructor() {
    super('cooldown', {
      event: 'cooldown',
      emitter: 'commandHandler',
      category: 'commandHandler'
    });
  }

  exec(message: Message, command: Command, remaning) {
    return message!.reply(`Please wait \`\`${ms(remaning)}\`\` before using \`\`${command}\`\``);
  }
}
