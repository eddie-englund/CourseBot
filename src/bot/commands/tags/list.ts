import { Command } from 'discord-akairo';
import { CourseClient } from '../../client/CourseClient';
import { Message, MessageEmbed } from 'discord.js';
import Tag from '../../../db/models/Tag';

export default class TagList extends Command {
  public client: CourseClient;
  public constructor() {
    super('tag-list', {
      aliases: ['tags'],
      category: 'tags',
      ratelimit: 2,
      channel: 'guild',
      description: {
        content: 'Sends a list of all tags.',
      },
    });
  }

  public async exec(message: Message) {
    const data = await Tag.find({ guildID: message.guild.id });
    if (!data) return message.reply(`There are not tags in in this guild!`);
    if (data.length < 1 || data === undefined)
      return message.util.reply('There are no tags in this guild. Consider creating one!');
    const tagEmbed: MessageEmbed = this.client.util
      .embed()
      .setColor(this.client.color.main)
      .setAuthor(message.author.tag, message.author.displayAvatarURL())
      .setTitle('Tags avalible in this guild')
      .setDescription(
        data
          .map((tag): string => `\`${tag.id}\``)
          .sort()
          .join(', ')
      );
    return message.util!.send(tagEmbed);
  }
}
