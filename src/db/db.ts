import { Logger } from '@ayana/logger';
const logger = Logger.get('DB');
import { Connection, connect, Types, connection } from 'mongoose';
import { Message, User, MessageEmbed, Guild } from 'discord.js';
import { stripIndents } from 'common-tags';
import Case from './models/Case';
import GuildSchema, { IGuild } from './models/Guild';
import { CourseClient } from 'src/bot/client/CourseClient';
import Profile, { IProfile } from './models/Profile';

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
  public async NewCase(message: Message, type?: string, offender?: User, reason?: string) {
    let caseID: number;
    const cases = await GuildSchema.findOne({ guildID: message.guild.id });
    if (!cases) caseID = 1;
    else caseID = cases.cases + 1;
    const newcase: {} = {
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
    };
    const merged = Object.assign({ _id: Types.ObjectId() }, newcase);
    const newCase = await new Case(merged);

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

  public async GetCase(caseNumber: Number) {
    const caseData = await Case.findOne({ case: caseNumber });
    if (!caseData) return Promise.resolve({ success: false, data: {} });
    return Promise.resolve({ success: true, data: caseData });
  }

  public async UpdateCase(caseNumber: Number, settings: {}) {
    let data = await Case.findOne({ case: caseNumber });

    if (typeof data !== 'object') data = {};
    for (const key in settings) {
      if (data[key] !== settings[key]) data[key] = settings[key];
      else return;
    }
    return await data.updateOne(settings);
  }

  public async CreateGuild(message: Message) {
    const settings: IGuild = {
      guild: message.guild.name,
      guildID: message.guild.id,
    };
    const merged = Object.assign({ _id: Types.ObjectId() }, settings);

    const newGuild = await new GuildSchema(merged);
    return newGuild.save();
  }

  public async GetGuild(guild: Guild) {
    const res = await GuildSchema.findOne({ guildID: guild.id });
    if (!res) return Promise.resolve({ success: false, data: {} });
    else return Promise.resolve({ success: true, data: { res } });
  }

  public async UpdateGuild(guild: Guild, settings: {}) {
    let data = await GuildSchema.findOne({ guildID: guild.id });

    if (typeof data !== 'object') data = {};
    for (const key in settings) {
      if (data[key] !== settings[key]) data[key] = settings[key];
      else return;
    }
    // eslint-disable-next-line consistent-return, no-return-await
    return await data.updateOne(settings);
  }

  public async NewProfile(message: Message, argUser: User) {
    const user = argUser.username || message.author.username;
    const userID = argUser.id || message.author.id;
    const settings: IProfile = {
      user,
      userID,
    };
    const merged = Object.assign({ _id: Types.ObjectId() }, settings);

    const newProfile = await new Profile(merged);
    return newProfile.save();
  }

  public async GetProfile(user: User) {
    const data = Profile.findOne({ userId: user.id });
    if (!data) Promise.resolve({ success: false, data: {} });
    Promise.resolve({ succsess: true, data });
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
