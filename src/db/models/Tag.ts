import { Schema, model } from 'mongoose';
import timestamp = require('mongoose-timestamp');

const tagSchema: Schema = new Schema({
  id: String,
  guildID: String,
  userID: String,
  tag: String,
});

tagSchema.plugin(timestamp);
export default model('Tag', tagSchema);
