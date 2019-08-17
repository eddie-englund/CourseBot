import { Message, MessageEmbed, Channel } from 'discord.js';
import CourseClient from '../client/CourseClient';

export = (client: CourseClient) => {
  client.log = async (message: Message, embed: MessageEmbed) => {
    const data = await client.getGuild(message.guild);
    if (!data) return;
    let channel;
    if (data.guildLog.channel === 'modlogs') {
      channel = message.guild.channels
        .filter(c => c.type === 'text')
        .find(x => x.name === 'modlogs');
    } else {
      channel = message.guild.channels
        .filter(c => c.type === 'text')
        .find(x => x.id === data.guildLog.channel);
    }
    // @ts-ignore
    return channel.send(embed);
  };
};
