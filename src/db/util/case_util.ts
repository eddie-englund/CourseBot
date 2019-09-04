import { CourseClient } from 'src/bot/client/CourseClient';
import Case from '../models/Case';
import mongoose from 'mongoose';
import { Message, User, MessageEmbed } from 'discord.js';
import { stripIndents } from 'common-tags';

export = (client: CourseClient) => {
  client.newCase = async (message: Message, type: string, offender: User, reason: string) => {
    let caseID: number;
    const cases = await client.getGuild(message.guild);
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
    const merged = Object.assign({ _id: mongoose.Types.ObjectId() }, newcase);
    const newCase = await new Case(merged);

    const caseEmbed: MessageEmbed = client.util
      .embed()
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
        caseEmbed.setColor(client.color.ban);
        break;
      case 'kick':
        caseEmbed.setColor(client.color.kick);
      default:
        caseEmbed.setColor(client.color.main);
    }

    await client.guildLog(message, caseEmbed);
    return newCase.save();
  };

  client.getCase = async (casenumber: number) => {
    const caseData = await Case.findOne({ case: casenumber });
    if (!caseData) return null;
    return caseData;
  };

  client.updateCase = async (Case, settings: {}) => {
    let data = await client.getCase(Case);

    if (typeof data !== 'object') data = {};
    for (const key in settings) {
      if (data[key] !== settings[key]) data[key] = settings[key];
      else return;
    }
    // eslint-disable-next-line consistent-return, no-return-await
    return await data.updateOne(settings).then(g => {
      console.log(g);
    });
  };
};
