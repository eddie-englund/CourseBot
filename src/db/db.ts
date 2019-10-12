import { Logger } from '@ayana/logger';
import { stripIndents } from 'common-tags';
import { Guild, Message, MessageEmbed, User } from 'discord.js';
import { connect, Connection, connection } from 'mongoose';
import { CourseClient } from 'src/bot/client/CourseClient';
import Case, { ICase } from './models/Case';
import GuildSchema, { IGuild } from './models/Guild';
import Profile, { IProfile } from './models/Profile';
import Tag, { ITag } from './models/Tag';
const logger = Logger.get('DB');

/**
 * Course database handler
 * @todo add Tags to the handler!
 * @example
 * const database = new DB({ URI: process.env.MONGO_URI, client: CourseClient});
 *
 * const newCase = datbase.NewCase(message, ban, User, "He spamed the chat with por");
 * const createGuild = database.CreateGuild(guild);
 * const getCase = dataBase.GetCase(1)
 * const editCase = database.UpdateCase(1, { reason: 'He spammed the chat with pornogrophy' })
 * const
 *
 */

interface Config {
	URI?: string | null;
}

export class DB {
  /**
   * @param {Object} Config.URI MongoURI
   * @param {CourseClient} CourseClient the CourseClient itself has to be passed in as well.
   */

	private connection: Connection = connection;
	private client: CourseClient;
	constructor(private config: Config = {}) {
		if (!this.config.URI) throw new Error('Please, provide a valid MongoDB URI');

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
		const cases = await GuildSchema.findOne({ guildID: message.guild.id });
		const caseId: number = !cases ? 1 : cases.cases + 1;

		const newCase = await new Case({
			case: caseId,
			casetype: type,
			reason: reason,
			prosecutor: {
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
        Offender: ${offender.tag} (${offender.id})
        Moderator: ${message.author.tag} (${message.author.id})
				Reason: ${reason}
				`
			)
			.setTimestamp(Date.now());

		["ban", "kick"].includes(type)
			? caseEmbed.setColor(this.client.color[type])
			: caseEmbed.setColor(this.client.color.main);

		await this.client.guildLog(message, caseEmbed);
		return newCase.save();
	}

	public async CreateGuild({ name, id }: Guild): Promise<IGuild> {
		const newGuild = await new GuildSchema({
			guild: name,
			guildID: id,
		});
		return newGuild.save();
	}

	public async NewProfile({ username, id }: User): Promise<IProfile> {
		const newProfile = await new Profile({
			user: username,
			userID: id,
		});
		return newProfile.save();
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

	public async GetCase(caseNumber: Number): Promise<ICase> {
		const data = await Case.findOne({ case: caseNumber });
		if (!data) return Promise.reject(false);
		return Promise.resolve(data);
	}

	public async GetGuild({ id }: Guild): Promise<IGuild> {
		const data = await GuildSchema.findOne({ guildID: id });
		if (!data) return Promise.reject(false);
		return Promise.resolve(data);
	}

	public async GetProfile(user: User): Promise<IProfile> {
		const data = Profile.findOne({ userId: user.id });
		if (!data) Promise.reject(false);
		return Promise.resolve(data);
	}

	public async GetTag({ guild }: Message, id: string): Promise<ITag> {
		const data = Tag.findOne({ guildId: guild.id, id });

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

	public async UpdateGuild({ id }: Guild, settings: {}): Promise<IGuild> {
		let data = await GuildSchema.findOne({ guildID: id });

		if (!data) return Promise.reject(false);

		if (typeof data !== 'object') data = {};
		for (const key in settings) {
			if (data[key] !== settings[key]) data[key] = settings[key];
			else return;
		}
		// eslint-disable-next-line consistent-return, no-return-await
		return await data.updateOne(settings);
	}

	public async UpdateProfile({ id }: User, settings: {}): Promise<IProfile> {
		let data = await Profile.findOne({ userID: id });

		if (!data) return Promise.reject(false);

		if (typeof data !== 'object') data = {};
		for (const key in settings) {
			if (data[key] !== settings[key]) data[key] = settings[key];
			else return;
		}
		return await data.updateOne(settings);
	}

	public async UpdateTag({ guild }: Message, id: string, settings: {}): Promise<ITag> {
		const data = Tag.findOne({ guildID: guild.id, id });
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
