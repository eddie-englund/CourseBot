import { Command } from 'discord-akairo';
import { CourseClient } from 'src/bot/client/CourseClient';
import { Message, GuildMember } from 'discord.js';

export default class Ban extends Command {
  public client: CourseClient;

  constructor() {
    super('ban', {
      aliases: ['ban', 'hammer'],
      userPermissions: ['BAN_MEMBERS'],
      clientPermissions: ['BAN_MEMBERS'],
      category: 'moderation',
      channel: 'guild',
      args: [
        {
          id: 'member',
          type: 'member',
          prompt: {
            optional: false,
            start: message => `${message.author}, who would you like to ban?`,
            retry: message => `${message.author}, are you sure you should be a moderator?`,
          },
        },
        {
          id: 'reason',
          match: 'rest',
          default: 'No reason provided',
        },
      ],
    });
  }

  public async exec(message: Message, { member, reason }: { member: GuildMember; reason: string }) {
    if (member.id === message.author!.id)
      return message.util!.send('Why in gods name would you even try to ban yourself?!');

    const guildData = await this.client.getGuild(message.guild);

    const channelEmbed = this.client.util
      .embed()
      .setColor(this.client.color.main)
      .setAuthor(message.author.tag, message.author.displayAvatarURL())
      .setDescription(`User: ${member.user.tag} has been banned. Reason: ${reason}`)
      .setTimestamp(Date.now());

    const banEmbed = this.client.util
      .embed()
      .setColor(this.client.color.main)
      .setAuthor(message.author.tag, message.author.displayAvatarURL())
      .setThumbnail(member.user.displayAvatarURL())
      .addField('**Banned user:**', member.user.tag, true)
      .addField('**Banned user id:**', member.id, true)
      .addField('**Reason:**', reason, true)
      .addField('**Banned by:**', message.author.tag, true)
      .addField('**Banned by id:**', message.author.id, true)
      .setTimestamp(Date.now());

    if (!guildData) {
      return message.reply(`Something went wrong please try again`);
    } else {
      try {
        await member.ban({ days: 2, reason: reason });
        await this.client.updateGuild({
          guildBans: [
            {
              user: member.user.tag,
              userID: member.id,
              date: Date.now(),
              reason: reason,
              bannedBy: {
                user: message.author.tag,
                userID: message.author.id,
              },
            },
          ],
        });
        await this.client.log(message, banEmbed);
        return message.util!.send(channelEmbed);
      } catch (error) {
        console.error(error);
        return message.reply(`Error: ${error.message}`);
      }
    }
  }
}
