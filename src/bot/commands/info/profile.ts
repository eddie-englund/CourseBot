import { Command } from 'discord-akairo';
import { CourseClient } from '../../client/CourseClient';
import { Message } from 'discord.js';

export default class Profile extends Command {
  public client: CourseClient;

  constructor() {
    super('profile', {
      aliases: ['profile', 'lookup', 'vet'],
      clientPermissions: ['SEND_MESSAGES'],
      userPermissions: ['SEND_MESSAGES'],
      category: 'info',
      ratelimit: 2,
      description: {
        content: `<@user> (argument not required)`,
        usage: '<optional argument>',
        examples: ['@Course'],
      },
      args: [
        {
          id: 'member',
          type: 'member',
          default: message => message.member,
        },
      ],
    });
  }

  public async exec(message: Message, { member }) {
    const userEmbed = this.client.util
      .embed()
      .setColor(this.client.color.main)
      .setAuthor(member.user.tag, member.user.displayAvatarURL())
      .setThumbnail(member.user.displayAvatarURL())
      .addField('❯ User: ', member.user.tag, true)
      .addField('❯ User id: ', member.id, true)
      .addField('❯ Joined guild at:', member.joinedAt, true)
      .addField('❯ Created account at:', member.user.createdAt, true);

    return message.util!.send(userEmbed);
  }
}
