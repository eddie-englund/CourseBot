import { Schema, model } from 'mongoose';
const timestamp = require('mongoose-timestamp');

const ProfileSchema: Schema = new Schema({
  user: String,
  userID: String,

  record: {
    warns: [
      {
        user: String,
        userID: String,
        reason: {
          type: String,
          default: 'no reason given'
        },
        date: String
      }
    ]
  },

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
