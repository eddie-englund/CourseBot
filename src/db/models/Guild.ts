import { Schema, model } from 'mongoose';
import timestamp = require('mongoose-timestamp');

const GuildSchema: Schema = new Schema({
  guild: String,
  guildID: String,
  cases: {
    type: Number,
    default: 0,
  },
  prefix: {
    type: String,
    default: '?',
  },
  guildLog: {
    active: {
      type: Boolean,
      default: false,
    },
    channel: {
      type: String,
      default: 'modlogs',
    },
  },
});

GuildSchema.plugin(timestamp);

export default model('Guild', GuildSchema);
