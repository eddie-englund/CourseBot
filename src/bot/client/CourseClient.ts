import { AkairoClient, CommandHandler, ListenerHandler } from 'discord-akairo';
import { join } from 'path';
import Guild from '../../db/models/Guild';
import { Logger } from '@ayana/logger';
import { Message, MessageEmbed, Channel } from 'discord.js';
import { DB } from '../../db/db';
import { ClientHttp2Session } from 'http2';

interface CourseConfig {
  URI?: string;
  TOKEN?: string;
}

export class CourseClient extends AkairoClient {
  public commandHandler: CommandHandler;
  public listenerHandler: ListenerHandler;
  public logger: Logger = Logger.get('Client');
  public config: CourseConfig;
  public db: DB;

  // Random util
  public guildLog: Function;
  public color: { main: string; red: string; ban: string; kick: string };

  constructor(config: CourseConfig) {
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

    this.config = config;

    this.db = new DB({ URI: this.config.URI });

    // Importing colors and the db models to this.client.color and this.client.models
    this.color = require('../util/color');
    this.guildLog = async (message: Message, embed: MessageEmbed) => {
      let channel: Channel = message.guild.channels
        .filter(c => c.type === 'text')
        .find(x => x.name === 'modlogs');

      const data = await this.db.GetGuild(message.guild);
      if (!data || data.guildLog.channel === 'modlogs') {
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

    // Handlers. Declaring: Directory, Guild specifc prefixes, taking mention as a prefix ,bot blocking, block self, set default settings for arguments and allow usage of the command util
    this.commandHandler = new CommandHandler(this, {
      directory: join(__dirname, '..', 'commands'),
      prefix: async msg => {
        const settings = await Guild.findOne({ guildID: msg.guild.id });
        if (settings) return settings.prefix;
        else return 'c/';
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
          ended:
            "More than 3 tries and you still didn't couldn't do it... The command has been cancelled.",
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
  }

  private async _init() {
    this.listenerHandler.setEmitters({
      commandHandler: this.commandHandler,
      listenerHandler: this.listenerHandler,
    });

    // Loading handlers

    this.commandHandler!.useListenerHandler(this.listenerHandler);
    this.listenerHandler.loadAll();
    this.logger.info('Listener handler loaded');
    this.commandHandler.loadAll();
    this.logger.info('Command Handler Loaded');
    this.db.init();
  }

  public async start(): Promise<string> {
    await this._init();
    return this.login(this.config.TOKEN);
  }
}