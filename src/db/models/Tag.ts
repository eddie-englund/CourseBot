import { Schema, model, Document, Model } from 'mongoose';
import timestamp = require('mongoose-timestamp');

export interface ITag extends Document {
  id: string;
  guildID: string;
  userID: string;
  tag: string;
}

const tagSchema: Schema = new Schema({
  id: String,
  guildID: String,
  userID: String,
  tag: String,
});

tagSchema.plugin(timestamp);
export default model('Tag', tagSchema);
