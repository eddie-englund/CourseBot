import { Command } from 'discord-akairo';
import { CourseClient } from 'src/bot/client/CourseClient';
import { Message, GuildMember, MessageEmbed } from 'discord.js';
import { stripIndents } from 'common-tags';

export class Kick extends Command {
  public client: CourseClient;

  public constructor() {
    super('kick', {
      aliases: ['kick'],
      userPermissions: ['KICK_MEMBERS'],
      clientPermissions: ['KICK_MEMBERS'],
      args: [
        {
          id: 'member',
          type: 'member',
          prompt: {
            start: (message: Message): string => `${message.author}, who would you like to kick?`,
            retry: (message: Message): string =>
              `${message.author}, are you sure you should be a moderator? Try agian...`,
          },
        },
        {
          id: 'kickReason',
          type: 'string',
          match: 'rest',
          default: 'no reason provided',
        },
      ],
    });
  }

  public async exec(message: Message, { member, kickReason }: { member: GuildMember; kickReason: string }) {
    if (member.id === message.author!.id) return;
    try {
      await member.kick(kickReason);
    } catch (error) {
      console.error(error);
      return message.util!.reply(`Failed to kick user **${member.user}**. Error message: ${error.message}`);
    }

    const kickEmbed: MessageEmbed = this.client.util
      .embed()
      .setColor(this.client.color.main)
      .setAuthor(message.author.tag, message.author.displayAvatarURL())
      .setDescription(
        stripIndents`Kicked user ${member.user.tag}
            reason: ${kickReason}
          `
      )
      .setTimestamp(Date.now());

    const logEmbed: MessageEmbed = this.client.util
      .embed()
      .setColor(this.client.color.main)
      .setDescription(
        stripIndents`Kicked member: ${member.user.tag}
            reason: ${kickReason}
            kicked by: ${message.author.tag} (${message.author.id})

          `
      )
      .setThumbnail(member.user.displayAvatarURL());

    await this.client.log(message, logEmbed);
    return message.util!.send(kickEmbed);
  }
}
