import { CourseClient } from 'src/bot/client/CourseClient';
import Case from '../models/Case';
import * as mongoose from 'mongoose';
import { Message, User } from 'discord.js';

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
