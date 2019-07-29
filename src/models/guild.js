const { Schema, model } = require('mongoose');
const { defaultSettings: defaults } = require('../util/config');

const GuildSchema = new Schema({
    guildID: String,
    guildName: String,
    prefix: {
        type: String,
        default: defaults.prefix
    },
    guildLog: {
        type: String,
        default: defaults.log
    }
});

const Guild = model('guild', GuildSchema);

module.exports = Guild;
