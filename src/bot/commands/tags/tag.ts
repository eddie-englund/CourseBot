import { Command, Flag } from "discord-akairo";
import { Message, MessageEmbed } from "discord.js";
import { stripIndents } from "common-tags";
import CourseClient from "../../client/CourseClient";

/**
 * @todo add **SHOW** and **DELETE** options for this command
 * @param option this is the option aka add, show or delete
 * @param parameter this is the paramter/id/name of the tag
 * @param item this is used for the add event. It's the rest after the argument aka what they want to save
 */

export default class Tag extends Command {
  client: CourseClient;
  public constructor() {
    super("tag", {
      aliases: ["tag"],
      category: "tag",
      channel: "guild",
      ratelimit: 2,
      args: [
        {
          id: "option",
          type: "string",
          prompt: {
            start: (message: Message): string =>
              `${message.author}, what can I do for you?`,
            retry: (message: Message): string =>
              `${message.author}, what do you want to do? add, delete, show etc`
          }
        },
        {
          id: "parameter",
          type: "string",
          prompt: {
            start: (message: Message): string =>
              `${
                message.author
              }, what is the name/id of the item that you want me to add/show/delete?`,
            retry: (message: Message): string =>
              `${message.author}, for gods sake, how hard can it be?!`
          }
        },
        {
          id: "item",
          type: "string",
          match: "rest"
        }
      ]
    });
  }

  public async exec(
    message: Message,
    {
      option,
      paramter,
      item
    }: { option: string; paramter: string; item: string }
  ) {
    // @ts-ignore
    const prefix = await this.handler.prefix(message);
    const newTagEmbed: MessageEmbed = this.client.util
      .embed()
      .setColor(this.client.color.main)
      .setAuthor(message.author.tag, message.author.displayAvatarURL())
      .setDescription(`Created tag: ${paramter}`)
      .setTimestamp(Date.now())
      .setFooter(`To see the tag use \`\`${prefix}\`\`tag show ${paramter}`);

    switch (option) {
      case "add" || "create" || "new":
        try {
          const newTag = {
            guildID: message.guild.id,
            id: paramter,
            tag: item
          };
          await this.client.createTag(newTag);
          return message.util!.send(newTagEmbed);
        } catch (error) {
          message.reply(
            `Something went wrong when creating tag: \`\`${paramter}\`\`. Error: ${
              error.message
            }`
          );
          console.error(error);
        }
        break;
    }
  }
}
