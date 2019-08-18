import { Command, Flag } from 'discord-akairo';
import { Message } from 'discord.js';
import { CourseClient } from 'src/bot/client/CourseClient';

export default class Settings extends Command {
  client: CourseClient;

  public constructor() {
    super('settings', {
      aliases: ['settings', 'setting', 'config'],
      category: 'settings',
      channel: 'guild',
      userPermissions: ['MANAGE_GUILD'],
      ratelimit: 2,
    });
  }

  public async *args() {
    const method = yield {
      type: [
        ['setting-init', 'init'],
        ['setting-prefix', 'prefix'],
        ['setting-channel', 'channel'],
        ['setting-log', 'log'],
      ],
      otherwise: async (message: Message) => {
        // @ts-ignore
        const prefix = await this.handler.prefix(message);
        return message.util!.reply(
          `I don't think you quite understand how this command works... To get more info do ${prefix}help settings`
        );
      },
    };
    return Flag.continue(method);
  }
}
