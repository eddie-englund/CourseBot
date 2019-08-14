import { AkairoClient, CommandHandler, ListenerHandler, Flag } from 'discord-akairo';
import { join } from 'path';
import Guild from '../../db/models/Guild';
import { Raw } from 'typeorm';
import { Util } from 'discord.js';
import Tag from '../../db/models/Tag';

export default class CourseClient extends AkairoClient {
  commandHandler: CommandHandler;
  listenerHandler: ListenerHandler;
  // Db
  getGuild: Function;
  updateGuild: Function;
  createGuild: Function;
  getProfile: Function;
  updateProfile: Function;
  createProfile: Function;
  getTag: Function;
  updateTag: Function;
  createTag: Function;
  deleteTag: Function;
  getTagAliases: Function;
  models: Object;
  log: Function;

  // Random util

  color;

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

    this.color = require('../util/color');
    this.models = require('../../db/index');

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

    this.listenerHandler = new ListenerHandler(this, {
      directory: join(__dirname, '..', 'events')
    });
    this.listenerHandler.setEmitters({
      commandHandler: this.commandHandler,
      listenerHandler: this.listenerHandler
    });
    this.commandHandler!.useListenerHandler(this.listenerHandler);
    this.listenerHandler.loadAll();
    this.commandHandler.loadAll();
  }
}
