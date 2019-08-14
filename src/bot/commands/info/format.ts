import { Command } from 'discord-akairo';
import CourseClient from 'src/bot/client/CourseClient';
import { Message, MessageEmbed } from 'discord.js';
import { stripIndents } from 'common-tags';

export default class Format extends Command {
    client: CourseClient;

    constructor() {
        super('format', {
            aliases: ['format', 'question'],
            channel: 'guild',
            category: 'info',
            clientPermissions: ['EMBED_LINKS', 'SEND_MESSAGES'],
            userPermissions: ['SEND_MESSAGES'],
            description: {
                content: 'Sends info on how to ask for help'
            }
        });
    }

    public async exec(message: Message) {
        const format: MessageEmbed = this.client.util
            .embed()
            .setColor(this.client.color.main)
            .setAuthor(message.author.tag, message.author.displayAvatarURL())
            .setDescription(
                stripIndents`
            **FORMAT**
            Error: https://paste.menudocs.org
            Code: https://paste.menudocs.org
        `
            )
            .setFooter('This is the best way to get help!');
        return message.util!.send(format);
    }
}
