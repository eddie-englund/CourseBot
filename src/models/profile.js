/* eslint-disable new-cap */
const { model, Schema } = require('mongoose');

const profileSchema = Schema({
    userID: String,
    user: String,
    reps: [
        {
            useriD: String,
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
    timestap: String
});

const Profile = model('Profile', profileSchema);
module.exports = Profile;
