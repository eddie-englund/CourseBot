import { Command } from 'discord-akairo';
import { CourseClient } from 'src/bot/client/CourseClient';
import { Message, GuildMember, MessageEmbed } from 'discord.js';
import { stripIndents } from 'common-tags';

export default class Warn extends Command {
  public client: CourseClient;

  public constructor() {
    super('warn', {
      aliases: ['warn'],
      userPermissions: ['BAN_MEMBERS'],
      clientPermissions: ['BAN_MEMBERS', 'KICK_MEMBERS'],
      channel: 'guild',
      category: 'moderation',
      description: {
        content: 'Warns a user.',
        usage: '<@user> <reason>',
        examples: ['@Titus broke the rules'],
      },
      args: [
        {
          id: 'member',
          type: 'member',
          prompt: {
            optional: false,
            start: message => `${message.author}, who would you like to warn?`,
            retry: message => `${message.author}, you need to @ the user to warn them!`,
          },
        },
        {
          id: 'reason',
          match: 'rest',
          default: 'No reason specified',
        },
      ],
    });
  }

  public async exec(message: Message, { member, reason }: { member: GuildMember; reason: string }) {
    const userData = await this.client.getProfile(member.user);

    const warnEmbed = this.client.util
      .embed()
      .setColor(this.client.color.main)
      .setAuthor(message.author.tag, message.author.displayAvatarURL())
      .setDescription(`**${message.author.tag}** has warned **${member.user.tag}**. Reason: ${reason}`)
      .setTimestamp(Date.now());
    if (!userData) {
      const newUser: { userID; user; record } = {
        userID: member.id,
        user: member.user.tag,
        record: {
          warns: {
            user: message.author.tag,
            userID: message.author.id,
            reason: reason,
            date: Date.now(),
          },
        },
      };
      await this.client.createProfile(newUser);
      await this.client.guildLog(message, warnEmbed);
      return message.util!.send(warnEmbed);
    } else {
      await this.client.updateProfile(member.user, {
        record: {
          warns: [
            {
              user: message.author.tag,
              userID: message.author.id,
              reason: reason,
              date: Date.now(),
            },
          ],
        },
      });

      switch (userData.record.warns.length) {
        case 2:
          message.util!.send(
            `<@${
              member.id
            }>, you now have two warnings. If you exceed two warnings you will be banned from this guild.`
          );
          break;
        case 3:
          try {
            member.ban({ days: 2, reason: reason });
          } catch (error) {
            console.error(error);
            const failed: MessageEmbed = this.client.util
              .embed()
              .setColor('#ff0008')
              .setAuthor(this.client.user.username, this.client.user.displayAvatarURL())
              .setDescription(
                `Failed to ban user: ${member.user.tag} (${member.id}). Error: ${error.message}`
              )
              .setTimestamp(Date.now());
            this.client.guildLog(message, failed);
          }
          const bannedEmbed: MessageEmbed = this.client.util
            .embed()
            .setColor(this.client.color.main)
            .setAuthor(message.author.tag, message.author.displayAvatarURL())
            .setDescription(
              stripIndents`Banned user: **${member.user.tag}**
                user id: ${member.id}
                reason: This person has exceeded two warnings.
                banned by: ${this.client.user.username}
            `
            )
            .setTimestamp(Date.now());
          await this.client.guildLog(message, bannedEmbed);
          break;
        default:
          await this.client.guildLog(message, warnEmbed);
          return message.util!.send(warnEmbed);
      }
    }
  }
}
