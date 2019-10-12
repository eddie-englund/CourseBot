import { Schema, model, Document, Model } from 'mongoose';
import timestamp = require('mongoose-timestamp');

export interface IProfile extends Document {
  user: string;
  userID: string;
  warns?: [
    {
      warnedBy: string;
      reason: string;
      date?: Date;
    }
  ];
}

const ProfileSchema: Schema = new Schema({
  user: String,
  userID: String,
  warns: [
    {
      warnedBy: String,
      reason: String,
      date: { type: Date, default: Date.now() },
    },
  ],
});

ProfileSchema.plugin(timestamp);

export default model('Profile', ProfileSchema);
