/* eslint-disable new-cap */
const { model, Schema } = require('mongoose');

const profileSchema = Schema({
    userID: String,
    username: String,
    guildID: String,
    credits: {
        type: Number,
        default: 0
    },
    createdAt: String
});

const Profile = model('Profile', profileSchema);
module.exports = Profile;
