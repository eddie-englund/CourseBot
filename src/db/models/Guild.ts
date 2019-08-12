import { Schema, model } from 'mongoose';
const timestamp = require('mongoose-timestamp');

const GuildSchema: Schema = new Schema({
  guild: String,
  guildID: String,
  guildLog: {
    channel: {
      type: String,
      default: 'modlogs'
    },
    active: {
      type: Boolean,
      default: true
    },
    guildBans: [
      {
        userID: String,
        user: String,
        reason: {
          type: String,
          default: 'No reason provided'
        },
        bannedBy: {
          user: String,
          userID: String
        },
        date: String
      }
    ],
    commands: {
      started: {
        type: Number,
        default: 0
      },
      finished: {
        type: Number,
        default: 0
      },
      canceled: {
        type: Number,
        default: 0
      }
    }
  },
  commands: {
    finshed: {
      type: Number,
      Default: 0
    },
    started: {
      type: Number,
      Default: 0
    },
    canceled: {
      type: Number,
      Default: 0
    }
  },
  prefix: {
    type: String,
    default: '?'
  },
  guildBank: {
    transactions: [
      {
        payee: {
          user: String,
          userID: String,
          amount: Number
        },
        userPaid: {
          user: String,
          userID: String,
          amount: Number
        }
      }
    ],
    accounts: [
      {
        id: {
          type: String,
          defualt: 'master'
        },
        credits: {
          default: 90000,
          type: Number
        }
      },
      {
        id: {
          type: String,
          default: 'tax'
        },
        credits: {
          default: 0,
          type: Number
        }
      }
    ],
    loans: [
      {
        userID: String,
        user: String,
        amount: {
          default: 0,
          type: Number
        }
      }
    ]
  }
});

GuildSchema.plugin(timestamp);

export default model('Guild', GuildSchema);
