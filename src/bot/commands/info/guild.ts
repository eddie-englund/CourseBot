import { Command } from 'discord-akairo';
import { Message, Guild, MessageEmbed } from 'discord.js';
import { CourseClient } from 'src/bot/client/CourseClient';

export class GuildProfile extends Command {
  public client: CourseClient;

  constructor() {
    super('serverProfile', {
      aliases: ['guild', 'server', 'guildinfo'],
      clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
      userPermissions: ['SEND_MESSAGES'],
      category: 'guild',
      channel: 'guild',
    });
  }

  public exec(message: Message) {
    const guild: Guild = message.guild;

    const guildEmbed: MessageEmbed = this.client.util
      .embed()
      .setColor(this.client.color.main)
      .setTitle(`${guild.name} guild info`)
      .setAuthor(guild.owner.user.tag, guild.owner.user.displayAvatarURL())
      .setThumbnail(guild.iconURL())
      .addField('Guild size:', guild.memberCount, true)
      .addField('Regarded "large":', guild.large, true)
      .addField('Is verified: ', guild.verified, true)
      .addField('Content filter level: ', guild.explicitContentFilter, true)
      .setFooter(`Guild created at ${guild.createdAt} `);

    if (guild.description) guildEmbed.setDescription(guild.description);

    return message.util!.send(guildEmbed);
  }
}
