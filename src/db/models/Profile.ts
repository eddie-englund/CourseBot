import { Schema, model } from 'mongoose';
import timestamp = require('mongoose-timestamp');

export interface IProfile {
  user: string;
  userID: string;
}

const ProfileSchema: Schema = new Schema({
  user: String,
  userID: String,
});

ProfileSchema.plugin(timestamp);

export default model('Profile', ProfileSchema);
