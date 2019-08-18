import { Command } from 'discord-akairo';
import { Message } from 'discord.js';
import CourseClient from '../../client/CourseClient';
import ms = require('ms');

export class Daily extends Command {
  client: CourseClient;

  constructor() {
    super('daily', {
      aliases: ['daily'],
      channel: 'guild',
      clientPermissions: ['SEND_MESSAGES'],
      userPermissions: ['SEND_MESSAGES'],
      category: 'economy',
      cooldown: ms('1d')
    });
  }

  public async exec(message: Message) {
    const Profile = await this.client.getProfile(message.author);
    if (!Profile) return message.reply(`Something has gone wrong! Please try again.`);
    else {
      const newCredits = Profile.wallet.credits + 20;
      const newTax = 5;
      await this.client.updateProfile(message.author, {
        wallet: { credits: newCredits }
      });
      await this.client.updateGuild(message.guild, {
        guildBank: { acounts: { tax: { credits: newTax } } }
      });

      const embed = this.client.util
        .embed()
        .setColor(this.client.color.main)
        .setAuthor(message.author.tag, message.author.displayAvatarURL())
        .setDescription(['💳 **|** You have gained 20 💵'])
        .setFooter('Taxes applied. Read more about taxes with the tax commadn');
      return message.util!.send(embed);
    }
  }
}
