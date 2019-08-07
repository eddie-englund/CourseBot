/* eslint-disable new-cap */
/* eslint-disable no-console */
const { Guild, Profile } = require('../models');
const mongoose = require('mongoose');

module.exports = client => {
    client.getGuild = async guild => {
        const data = await Guild.findOne({ guildID: guild.id });
        if (data) return data;
        else return client.config.defaultSettings;
    };

    client.getProfile = async user => {
        const data = await Profile.findOne({ userID: user.id });
        if (data) return data;
        // eslint-disable-next-line consistent-return, no-useless-return
        else return;
    };

    client.deleteProfile = async (guild, user) => {
        const data = await Profile.deleteOne({
            userID: user.id,
            guildID: guild.id
        });
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

    client.updateProfile = async (user, settings) => {
        let data = await client.getProfile(user);

        if (typeof data !== 'object') data = {};
        for (const key in settings) {
            if (data[key] !== settings[key]) data[key] = settings[key];
            else return;
        }
        // eslint-disable-next-line consistent-return, no-return-await
        return await data.updateOne(settings);
    };

    client.createGuild = async settings => {
        // eslint-disable-next-line new-cap
        const merged = Object.assign({ _id: mongoose.Types.ObjectId() }, settings);

        const newGuild = await new Guild(merged);
        return newGuild.save().then(g => {
            console.log(`Created db instance for guild "${g.guildName}" (${g.guildID})`);
        });
    };

    client.createProfile = async settings => {
        // eslint-disable-next-line new-cap
        const merged = Object.assign({ _id: mongoose.Types.ObjectId() }, settings);

        const newProfile = await new Profile(merged);
        return newProfile.save().then(g => {
            console.log(`Created db instance for user "${g.user}" (${g.userID})`);
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
