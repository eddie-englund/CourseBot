import { Listener } from 'discord-akairo';
import { CourseClient } from '../../client/CourseClient';
import { Message } from 'discord.js';
import { TOPICS, EVENTS } from '../../util/logger';

export default class MessageDeleteBulk extends Listener {
  public client: CourseClient;

  public constructor() {
    super('messageDeleteBulk', {
      event: 'messageDeleteBulk',
      emitter: 'client',
      category: 'client',
    });
  }

  public async exec(message: Message) {
    try {
      await this.client.newCase(message, 'messageDeleteBulk', message.author, 'unknown');
    } catch (error) {
      this.client.logger.error(error, { topic: TOPICS.DATABASE, event: EVENTS.ERROR });
    }
  }
}
