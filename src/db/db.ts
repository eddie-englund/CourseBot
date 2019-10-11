import { Logger } from '@ayana/logger';
const logger = Logger.get('DB');
import { Connection, connect, Types, connection } from 'mongoose';
import { Message, User, MessageEmbed, Guild } from 'discord.js';
import { stripIndents } from 'common-tags';
import Case, { ICase } from './models/Case';
import GuildSchema, { IGuild } from './models/Guild';
import { CourseClient } from 'src/bot/client/CourseClient';
import Profile, { IProfile } from './models/Profile';
import Tag, { ITag } from './models/Tag';
import { promises } from 'dns';

/**
 * Course database handler
 * @todo add Tags to the handler!
 * @example
 * const database = new DB({ URI: process.env.MONGO_URI, client:CourseClient});
 *
 * const newCase = datbase.NewCase(message, ban, User, "He spamed the chat with por");
 * const getCase = dataBase.GetCase(1)
 * const editCase = database.UpdateCase(1, { reason: 'He spammed the chat with pornogrophy' })
 *
 */

interface Config {
  URI?: string | null;
}

export class DB {
  /**
   * @param {Object} Config.URI MongoURI
   * @param {class} CourseClient the CourseClient itself has to be passed in as well.
   */

  private connection: Connection = connection;
  private config: Config;
  private client: CourseClient;
  constructor(config: Config = {}) {
    this.config = config;
    if (!this.config.URI) throw new Error('Please, provde a valid mongoDB URI');

    this.connection.on('connected', () => {
      logger.info(`Connected to database`);
    });

    this.connection.on('err', (err: Error) => {
      logger.error(err);
    });

    this.connection.on('disconnected', () => {
      logger.warn(`Disconnected from database`);
    });
  }

  // NOTE: Add user check so that only the person who initated the case can edit it.
  public async NewCase(message: Message, type?: string, offender?: User, reason?: string): Promise<ICase> {
    let caseID: number;
    const cases = await GuildSchema.findOne({ guildID: message.guild.id });
    if (!cases) caseID = 1;
    else caseID = cases.cases + 1;

    const newCase = await new Case({
      case: caseID,
      casetype: type,
      reason: reason,
      prossectutor: {
        id: message.author.id,
        name: message.author.tag,
      },
      offender: {
        id: offender.id,
        name: offender.tag,
      },
      timestamp: Date.now(),
    });

    const caseEmbed: MessageEmbed = new MessageEmbed()
      .setAuthor(message.author.tag, message.author.displayAvatarURL())
      .setDescription(
        stripIndents`New case: ${type}
        offender: ${offender.tag} (${offender.id})
        moderator: ${message.author.tag} (${message.author.id})
        reason: ${reason}
      `
      )
      .setTimestamp(Date.now());

    switch (type) {
      case 'ban':
        caseEmbed.setColor(this.client.color.ban);
        break;
      case 'kick':
        caseEmbed.setColor(this.client.color.kick);
      default:
        caseEmbed.setColor(this.client.color.main);
    }

    await this.client.guildLog(message, caseEmbed);
    return newCase.save();
  }

  public async GetCase(caseNumber: Number): Promise<ICase> {
    const data = await Case.findOne({ case: caseNumber });
    if (!data) return Promise.reject(false);
    return Promise.resolve(data);
  }

  public async UpdateCase(caseNumber: Number, settings: {}): Promise<ICase> {
    let data = await Case.findOne({ case: caseNumber });

    if (typeof data !== 'object') data = {};
    for (const key in settings) {
      if (data[key] !== settings[key]) data[key] = settings[key];
      else return;
    }
    return await data.updateOne(settings);
  }

  public async CreateGuild(guild: Guild): Promise<IGuild> {
    const newGuild = await new GuildSchema({
      guild: guild.name,
      guildID: guild.id,
    });
    return newGuild.save();
  }

  public async GetGuild(guild: Guild): Promise<IGuild> {
    const data = await GuildSchema.findOne({ guildID: guild.id });
    if (!data) return Promise.reject(false);
    return Promise.resolve(data);
  }

  public async UpdateGuild(guild: Guild, settings: {}): Promise<IGuild> {
    let data = await GuildSchema.findOne({ guildID: guild.id });

    if (!data) return Promise.reject(false);

    if (typeof data !== 'object') data = {};
    for (const key in settings) {
      if (data[key] !== settings[key]) data[key] = settings[key];
      else return;
    }
    // eslint-disable-next-line consistent-return, no-return-await
    return await data.updateOne(settings);
  }

  public async NewProfile(argUser: User): Promise<IProfile> {
    const user = argUser.username;
    const userID = argUser.id;

    const newProfile = await new Profile({
      user,
      userID,
    });
    return newProfile.save();
  }

  public async GetProfile(user: User): Promise<IProfile> {
    const data = Profile.findOne({ userId: user.id });
    if (!data) Promise.reject(false);
    return Promise.resolve(data);
  }

  public async UpdateProfile(user: User, settings: {}): Promise<IProfile> {
    let data = await Profile.findOne({ userID: user.id });

    if (!data) return Promise.reject(false);

    if (typeof data !== 'object') data = {};
    for (const key in settings) {
      if (data[key] !== settings[key]) data[key] = settings[key];
      else return;
    }
    return await data.updateOne(settings);
  }

  public async NewTag(message: Message, id: string, content: string): Promise<ITag> {
    const newTagModel = await new Tag({
      id: id,
      guildID: message.guild.id,
      userID: message.author.id,
      tag: content,
    });
    return newTagModel.save();
  }

  public async GetTag(message: Message, id: string): Promise<ITag> {
    const data = Tag.findOne({ guildId: message.guild.id, id });

    if (!data) return Promise.reject(false);
    return Promise.resolve(data);
  }

  public async UpdateTag(message: Message, id: string, settings: {}): Promise<ITag> {
    let data = Tag.findOne({ guildID: message.guild.id, id });
    if (!data) Promise.reject(false);

    for (const key in settings) {
      if (data[key] !== settings[key]) data[key] = settings[key];
      else return;
    }
    // eslint-disable-next-line consistent-return, no-return-await
    return await data.updateOne(settings);
  }

  public async DeleteTag(id: string, user: User, guild: Guild): Promise<ITag> {
    const data = await Tag.findOne({ id, userID: user.id, guildID: guild.id });
    if (!data) Promise.reject(false);
    return Tag.deleteOne({ id: id, userID: user.id, guildID: guild.id });
  }

  public async init() {
    return await connect(
      this.config.URI,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        autoIndex: true,
        reconnectTries: Number.MAX_VALUE,
        reconnectInterval: 500,
        poolSize: 5,
        connectTimeoutMS: 10000,
        family: 4,
      }
    );
  }
}
