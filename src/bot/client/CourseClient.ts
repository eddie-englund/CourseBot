import { AkairoClient, CommandHandler, ListenerHandler, Flag } from 'discord-akairo';
import { join } from 'path';
import Guild from '../../db/models/Guild';
import { Logger } from 'winston';
import { logger, TOPICS, EVENTS } from '../util/logger';
import { Message, MessageEmbed, Channel, Util } from 'discord.js';

export class CourseClient extends AkairoClient {
  public commandHandler: CommandHandler;
  public listenerHandler: ListenerHandler;
  public logger: Logger = logger;

  // **Db functions**
  // Guild functions
  public getGuild: Function;
  public updateGuild: Function;
  public createGuild: Function;

  // Profile/User functions
  public getProfile: Function;
  public updateProfile: Function;
  public createProfile: Function;

  // Tags functions
  public getTag: Function;
  public updateTag: Function;
  public createTag: Function;
  public deleteTag: Function;
  public getTagAliases: Function;

  // Case functions

  public newCase: Function;
  public updateCase: Function;
  public editCase: Function;
  public getCase: Function;

  // Random util
  public guildLog: Function;
  public color: { main };

  constructor() {
    super(
      {
        ownerID: process.env.ownerID,
      },
      {
        disableEveryone: true,
        messageCacheMaxSize: 1000,
        disabledEvents: ['TYPING_START'],
      }
    );

    // Importing colors and the db models to this.client.color and this.client.models
    this.color = require('../util/color');
    this.guildLog = async (message: Message, embed: MessageEmbed) => {
      let channel: Channel = message.guild.channels
        .filter(c => c.type === 'text')
        .find(x => x.name === 'modlogs');

      const data = await this.getGuild(message.guild);
      if (!data || data.guildLog.channel === 'modlogs') {
        channel = message.guild.channels.filter(c => c.type === 'text').find(x => x.name === 'modlogs');
      } else {
        channel = message.guild.channels
          .filter(c => c.type === 'text')
          .find(x => x.id === data.guildLog.channel);
      }
      // @ts-ignore
      return channel.send(embed);
    };

    // Handlers. Declaring: Directory, Guild specifc prefixes, taking mention as a prefix ,bot blocking, block self, set default settings for arguments and allow usage of the command util
    this.commandHandler = new CommandHandler(this, {
      directory: join(__dirname, '..', 'commands'),
      prefix: async msg => {
        const settings = await Guild.findOne({ guildID: msg.guild.id });
        if (settings) return settings.prefix;
        else return '?';
      },
      blockBots: true,
      blockClient: true,
      allowMention: true,
      defaultCooldown: 5000,
      ignoreCooldown: [],
      commandUtil: true,
      argumentDefaults: {
        prompt: {
          modifyStart: (_, str): string => `${str}\n\nType \`cancel\` to cancel the command.`,
          modifyRetry: (_, str): string => `${str}\n\nType \`cancel\` to cancel the command.`,
          timeout: 'Guess you took too long, the command has been cancelled.',
          ended: "More than 3 tries and you still didn't couldn't do it... The command has been cancelled.",
          cancel: 'The command has been cancelled.',
          retries: 3,
          time: 30000,
        },
        otherwise: '',
      },
      aliasReplacement: /-/g,
    });
    // Declaring the listener handler and it's directory
    this.listenerHandler = new ListenerHandler(this, {
      directory: join(__dirname, '..', 'events'),
    });
    // Allowing the handler ot use the events emitted by the commandHandler and the ListenerHandler
    this.listenerHandler.setEmitters({
      commandHandler: this.commandHandler,
      listenerHandler: this.listenerHandler,
    });

    // Loading handlers

    this.commandHandler!.useListenerHandler(this.listenerHandler);
    this.listenerHandler.loadAll();
    this.logger.info('Listener handler loaded', { topic: TOPICS.DISCORD_AKAIRO, event: EVENTS.INIT });
    this.commandHandler.loadAll();
    this.logger.info('Command Handler Loaded', { topic: TOPICS.DISCORD_AKAIRO, event: EVENTS.INIT });
  }
}
