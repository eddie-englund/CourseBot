import { Command } from 'discord-akairo';
import CourseClient from 'src/bot/client/CourseClient';
import { Message, GuildMember } from 'discord.js';

export default class Warn extends Command {
  client: CourseClient;

  constructor() {
    super('warn', {
      aliases: ['warn'],
      userPermissions: ['BAN_MEMBERS'],
      clientPermissions: ['BAN_MEMBERS', 'KICK_MEMBERS'],
      channel: 'guild',
      category: 'moderation',
      args: [
        {
          id: 'member',
          type: 'member',
          prompt: {
            optional: false,
            start: message => `${message.author}, who would you like to warn?`,
            retry: message => `${message.author}, you need to @ the user to warn them!`
          }
        },
        {
          id: 'reason',
          match: 'rest',
          default: 'No reason specified'
        }
      ]
    });
  }

  public async exec(message: Message, { member, reason }: { member: GuildMember; reason: string }) {
    const userData = await this.client.getProfile(member.user);
    if (!userData) return message.reply('Something went wrong! Please try again');
    else {
      await this.client.updateProfile(member.user, {
        record: {
          warns: [
            {
              user: message.author.tag,
              userID: message.author.id,
              reason: reason,
              date: Date.now()
            }
          ]
        }
      });

      const warnEmbed = this.client.util
        .embed()
        .setColor(this.client.color.main)
        .setAuthor(message.author.tag, message.author.displayAvatarURL())
        .setDescription(
          `**${message.author.tag}** has warned **${member.user.tag}**. Reason: ${reason}`
        );

      message.util!.send(warnEmbed);
      return this.client.log(message, warnEmbed);
    }
  }
}
