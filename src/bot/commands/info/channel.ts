import { Command } from 'discord-akairo';
import { google } from 'googleapis';
import { stripIndents } from 'common-tags';
import { Message } from 'discord.js';
import { CourseClient } from '../../client/CourseClient';
const auth = process.env.YOUTUBETOKEN;
const service = google.youtube('v3');

export default class YoutubeChannel extends Command {
  public client: CourseClient;
  constructor() {
    super('yt', {
      aliases: ['channel', 'youtube', 'subs'],
      clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
      userPermissions: ['SEND_MESSAGES'],
      ratelimit: 2,
      category: 'info',
      channel: 'guild',
      description: {
        content: 'Sends information about Gary Simons youtube channel DesignCourse(courestro).',
      },
    });
  }

  public async exec(message: Message) {
    const response = await service.channels
      .list({
        auth,
        id: 'UCVyRiMvfUNMA1UPlDPzG5Ow',
        part: 'snippet,contentDetails,statistics',
      })
      .catch(console.error);
    if (!response) return;
    const channels = response.data.items;
    const uploads = await service.playlistItems
      .list({
        auth,
        part: 'snippet, contentDetails',
        playlistId: channels[0].contentDetails.relatedPlaylists.uploads,
      })
      .catch(console.error);
    if (!uploads) return;
    const latest = uploads.data.items.sort((a, b) => a.snippet.position - b.snippet.position)[0];
    const channel = channels[0];
    const embed = this.client.util
      .embed()
      .setColor(this.client.color.main)
      .setAuthor(
        'DesingCourse(coursetro) youtube Channel Info',
        'https://yt3.ggpht.com/a/AGF-l7-o7kerdDSATMKwSTOyOznS6OM5-2JCcvDt1g=s288-c-k-c0xffffffff-no-rj-mo'
      )
      .setDescription(
        stripIndents`
                Designcourse currently has ${channel.statistics.subscriberCount} subscribers with ${channel.statistics.videoCount} videos.
                [Newest Video](https://www.youtube.com/watch?v=${latest.contentDetails.videoId})
            
            `
      )
      .setFooter('Last video uploaded')
      // @ts-ignore
      .setTimestamp(latest.contentDetails.videoPublishedAt);
    return message.util.send(embed);
  }
}
