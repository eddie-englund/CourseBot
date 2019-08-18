import { AkairoClient, CommandHandler, ListenerHandler } from 'discord-akairo';
import { join } from 'path';
import Guild from '../../db/models/Guild';

export default class CourseClient extends AkairoClient {
  commandHandler: CommandHandler;
  listenerHandler: ListenerHandler;

  // Db functions
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

  // Db models
  public models: Object;

  // Random util
  public log: Function;
  public color: any;

  constructor() {
    super(
      {
        ownerID: process.env.ownerID
      },
      {
        disableEveryone: true,
        messageCacheMaxSize: 1000,
        disabledEvents: ['TYPING_START']
      }
    );

    // Importing colors and the db models to this.client.color and this.client.models
    this.color = require('../util/color');
    this.models = require('../../db/index');

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
          modifyStart: (_, str): string =>
            `${str}\n\nType \`cancel\` to cancel the command.`,
          modifyRetry: (_, str): string =>
            `${str}\n\nType \`cancel\` to cancel the command.`,
          timeout: 'Guess you took too long, the command has been cancelled.',
          ended:
            "More than 3 tries and you still didn't couldn't do it... The command has been cancelled.",
          cancel: 'The command has been cancelled.',
          retries: 3,
          time: 30000
        },
        otherwise: ''
      },
      aliasReplacement: /-/g
    });
    // Declaring the listener handler and it's directory
    this.listenerHandler = new ListenerHandler(this, {
      directory: join(__dirname, '..', 'events')
    });
    // Allowing the handler ot use the events emitted by the commandHandler and the ListenerHandler
    this.listenerHandler.setEmitters({
      commandHandler: this.commandHandler,
      listenerHandler: this.listenerHandler
    });

    // Loading handlers

    this.commandHandler!.useListenerHandler(this.listenerHandler);
    this.listenerHandler.loadAll();
    this.commandHandler.loadAll();
  }
}
