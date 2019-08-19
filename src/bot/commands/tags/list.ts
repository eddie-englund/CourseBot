import { Command } from 'discord-akairo';
import { CourseClient } from 'src/bot/client/CourseClient';
import { Message, MessageEmbed } from 'discord.js';
import tag from '../../../db/models/Tag';

export default class TagList extends Command {
  public client: CourseClient;

  public constructor() {
    super('tag-list', {
      category: 'tags',
      ratelimit: 2,
      channel: 'guild',
      description: {
        content: 'Sends a list of all tags.',
      },
    });
  }

  public async exec(message: Message) {
    const data = await tag.find({ guildID: message.guild.id });
    if (!data) return message.reply(`It seems like I don't have any tags saved for this guild!`);
    const list = [];
    await data.forEach(Object => {
      list.push(Object.id);
    });
    const tagEmbed: MessageEmbed = this.client.util
      .embed()
      .setColor(this.client.color.main)
      .setAuthor(message.author.tag, message.author.displayAvatarURL())
      .setTitle('List of all tags in this guild')
      .setDescription(
        data
          .map((tag): string => `\`${tag.id}\``)
          .sort()
          .join(', ')
      );
    return message.util!.send(tagEmbed);
  }
}
