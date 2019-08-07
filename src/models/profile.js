/* eslint-disable new-cap */
const { model, Schema } = require('mongoose');

const profileSchema = Schema({
    userID: String,
    user: String,
    reps: [
        {
            userID: String,
            user: String,
            date: String
        }
    ],
    credits: {
        amount: {
            type: Number,
            default: 0
        },
        date: String
    },
    level: {
        rank: {
            type: Number,
            default: 1
        },
        xp: {
            type: Number,
            default: 0
        }
    },
    timestap: String
});

const Profile = model('Profile', profileSchema);
module.exports = Profile;
