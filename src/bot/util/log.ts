import { Message, MessageEmbed } from 'discord.js';
import CourseClient from '../client/CourseClient';

export = (client: CourseClient) => {
  client.log = async (message: Message, embed: MessageEmbed) => {
    const data = await client.getGuild(message.guild);
    if (!data || data.guildLog.active === false) return;
    const logChannel = message.guild.channels
      .filter(x => x.type === 'text')
      .find(c => c.name === data.guildLog.channel);
    if (!logChannel) return;
    // @ts-ignore
    return logChannel.send(embed);
  };
};
