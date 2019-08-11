import { Command } from 'discord-akairo';
import DongClient from 'src/bot/client/DongClient';
import { Message } from 'discord.js';

export default class Profile extends Command {
  client: DongClient;

  constructor() {
    super('profile', {
      aliases: ['profile', 'lookup', 'vet'],
      clientPermissions: ['SEND_MESSAGES'],
      userPermissions: ['SEND_MESSAGES'],
      category: 'social',
      description: {
        content: `<@ user> (argument not required)`,
        usage: '<argument>',
        examples: ['@Course']
      },
      args: [
        {
          id: 'member',
          type: 'member',
          default: message => message.member
        }
      ]
    });
  }

  public async exec(message: Message, { member }) {
    const userEmbed = this.client.util
      .embed()
      .setColor('#e60b5f')
      .setAuthor(member.user.tag, member.user.displayAvatarURL())
      .setThumbnail(member.user.displayAvatarURL())
      .addField('❯ User: ', member.user.tag, true)
      .addField('❯ User id: ', member.id, true)
      .addField('❯ Joined guild at:', member.joinedAt, true)
      .addField('❯ Created account at:', member.user.createdAt, true);

    const Profile = await this.client.getProfile(member.user);
    if (!Profile) return message!.util.send(userEmbed);
    else {
      userEmbed.addField('❯ Credits: ', Profile.wallet.credits, true);
      userEmbed.addField('❯ Depbt: ', Profile.wallet.loan.credits, true);
      userEmbed.addField('❯ Loans taken: ', `${Profile.wallet.loan.loans.length}`, true);
      return message.util!.send(userEmbed);
    }
  }
}
