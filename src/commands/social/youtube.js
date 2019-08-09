const { Command } = require('discord-akairo');
const { google } = require('googleapis');
const auth = process.env.YOUTUBETOKEN;
const { stripIndents } = require('common-tags');
const service = google.youtube('v3');

class YoutubeChannel extends Command {
    constructor() {
        super('yt', {
            aliases: ['channel', 'yt', 'gary'],
            clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
            userPermissions: ['SEND_MESSAGES']
        });
    }

    async exec(message) {
        const response = await service.channels
            .list({
                auth,
                id: 'UCVyRiMvfUNMA1UPlDPzG5Ow',
                part: 'snippet,contentDetails,statistics'
            })
            .catch(console.error);
        if (!response) return;
        const channels = response.data.items;
        const uploads = await service.playlistItems
            .list({
                auth,
                part: 'snippet, contentDetails',
                playlistId: channels[0].contentDetails.relatedPlaylists.uploads
            })
            .catch(console.error);
        if (!uploads) return;
        const latest = uploads.data.items.sort(
            (a, b) => a.snippet.position - b.snippet.position
        )[0];
        const channel = channels[0];
        const embed = this.client.util
            .embed()
            .setColor(this.client.color.main)
            .setAuthor(
                'DesingCourse youtube Channel Info',
                'https://yt3.ggpht.com/a/AGF-l7-o7kerdDSATMKwSTOyOznS6OM5-2JCcvDt1g=s288-c-k-c0xffffffff-no-rj-mo'
            )
            .setDescription(
                stripIndents`
                Designcourse currently has ${channel.statistics.subscriberCount} subscribers with ${channel.statistics.videoCount} videos.

                [Newest Video](https://www.youtube.com/watch?v=${latest.contentDetails.videoId})
            
            `
            )
            .setFooter('Last video uploaded')
            .setTimestamp(latest.contentDetails.videoPublishedAt);
        message.util.send(embed);
    }
}

module.exports = YoutubeChannel;
