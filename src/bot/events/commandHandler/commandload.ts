import { Listener } from 'discord-akairo';
import { CourseClient } from '../../client/CourseClient';
import { TOPICS, EVENTS } from '../../util/logger';

export default class CommandLoad extends Listener {
  public client: CourseClient;

  public constructor() {
    super('load', {
      event: 'load',
      emitter: 'commandHandler',
      category: 'commandHandler',
    });
  }

  public exec(command) {
    this.client.logger.info(`Loaded command: ${command}`, {
      topic: TOPICS.DISCORD_AKAIRO,
      event: EVENTS.INIT,
    });
  }
}
