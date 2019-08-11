import { Schema, model } from 'mongoose';
const timestamp = require('mongoose-timestamp');

const ProfileSchema: Schema = new Schema({
  user: String,
  userID: String,
  wallet: {
    credits: {
      type: Number,
      default: 0
    },
    loan: {
      credits: {
        type: Number,
        default: 0
      },
      loans: [String]
    }
  }
});

ProfileSchema.plugin(timestamp);

export default model('Profile', ProfileSchema);
