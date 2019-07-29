/* eslint-disable no-console */
const { Guild, User } = require('../models');
const mongoose = require('mongoose');

module.exports = client => {
    client.getGuild = async guild => {
        const data = await Guild.findOne({ guildID: guild.id });
        if (data) return data;
        else return client.config.defaultSettings;
    };

    client.getUser = async user => {
        const data = await User.findOne({ userID: user.id });
        if (data) return data;
        else throw new Error('Failed to supply valid user data');
    };

    client.deleteUser = async (guild, user) => {
        const data = await User.deleteOne({ userID: user.id, guildID: guild.id });
        if (data) return data;
        else throw new Error('Failed to supply valid user data');
    };

    client.updateGuild = async (guild, settings) => {
        let data = await client.getGuild(guild);

        if (typeof data !== 'object') data = {};
        for (const key in settings) {
            if (data[key] !== settings[key]) data[key] = settings[key];
            else return;
        }
        console.log(
            `Guild "${data.guildName}" (${data.guildID}) updated settings: ${Object.keys(settings)}`
        );
        // eslint-disable-next-line consistent-return, no-return-await
        return await data.updateOne(settings);
    };

    client.createGuild = async settings => {
        // eslint-disable-next-line new-cap
        const merged = Object.assign({ _id: mongoose.Types.ObjectId() }, settings);

        const newGuild = await new Guild(merged);
        return newGuild.save().then(g => {
            console.log(`Default settings saved for guild "${g.guildName}" (${g.guildID})`);
        });
    };

    client.clean = text => {
        if (typeof text === 'string') {
            return text
                .replace(/`/g, `\`${String.fromCharCode(8203)}`)
                .replace(/@/g, `@${String.fromCharCode(8203)}`);
        } else {
            return text;
        }
    };
};
