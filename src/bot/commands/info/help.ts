import { Command } from 'discord-akairo';
import { Message } from 'discord.js';
import { stripIndents } from 'common-tags';
import { CourseClient } from 'src/bot/client/CourseClient';

export default class HelpCommand extends Command {
  public client: CourseClient;
  public constructor() {
    super('help', {
      aliases: ['help'],
      description: {
        content: 'Displays a list of available commands, or detailed information for a specified command.',
        usage: '[command]',
      },
      category: 'info',
      clientPermissions: ['EMBED_LINKS'],
      ratelimit: 2,
      args: [
        {
          id: 'command',
          type: 'commandAlias',
        },
      ],
    });
  }

  public async exec(message: Message, { command }: { command: Command }): Promise<Message | Message[]> {
    // @ts-ignore
    const prefix = await this.handler.prefix(message);
    if (!command) {
      const embed = this.client.util
        .embed()
        .setColor(this.client.color.main)
        .setDescription(
          stripIndents`❯ Commands
					For additional info on a command, type \`${prefix}help <command>\``
        );

      for (const category of this.handler.categories.values()) {
        embed.addField(
          `❯ ${category.id.replace(/(\b\w)/gi, (lc): string => lc.toUpperCase())}`,
          `${category
            .filter((cmd): boolean => cmd.aliases.length > 0)
            .map((cmd): string => `\`${cmd.aliases[0]}\``)
            .join(' ')} `
        );
      }

      return message.util!.send(embed);
    }

    const embed = this.client.util
      .embed()
      .setColor(this.client.color.main)
      .setTitle(`\`${command.aliases[0]} ${command.description.usage ? command.description.usage : ''}\``)
      .addField('❯ Description', command.description.content || '\u200b');

    if (command.aliases.length > 1) embed.addField('❯ Aliases', `\`${command.aliases.join('` `')}\``, true);
    if (command.description.examples && command.description.examples.length)
      embed.addField(
        '❯ Examples',
        `\`${command.aliases[0]} ${command.description.examples.join(`\`\n\`${command.aliases[0]} `)}\``,
        true
      );

    return message.util!.send(embed);
  }
}
