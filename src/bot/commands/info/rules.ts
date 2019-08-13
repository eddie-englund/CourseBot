import { Command } from 'discord-akairo';
import CourseClient from 'src/bot/client/CourseClient';
import { Message, MessageEmbed } from 'discord.js';
import { stripIndents } from 'common-tags';

export default class Rules extends Command {
  client: CourseClient;

  constructor() {
    super('rules', {
      aliases: ['rules'],
      clientPermissions: ['SEND_MESSAGES'],
      userPermissions: ['SEND_MESSAGES'],
      channel: 'guild',
      category: 'info'
    });
  }

  public exec(message: Message) {
      const rulesEmbed: MessageEmbed = this.client.util!.embed()
        .setColor(this.client.color.main)
        .setAuthor(message.author.tag, message.author.displayAvatarURL())
        .setDescription(stripIndents`
            **You've violated the rules**
            Please read the rules in the rules channel.
        `)
        .setTimestamp(Date.now())
  }
}
