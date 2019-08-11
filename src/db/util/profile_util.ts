import DongClient from 'src/bot/client/DongClient';
import Profile from '../models/Profile';
import * as mongoose from 'mongoose';

export = (client: DongClient) => {
  client.getProfile = async user => {
    const res = await Profile.findOne({ userID: user.id });
    if (res) return res;
    else {
      const newProfile: Object = {
        user: user.tag,
        userID: user.id
      };
      await client.createProfile(newProfile);
      const newRes = await Profile.findOne({ userID: user.id });
      if (newRes) return newRes;
      else return;
    }
  };

  client.createProfile = async settings => {
    const merged = Object.assign({ _id: mongoose.Types.ObjectId() }, settings);

    const newProfile = await new Profile(merged);
    return newProfile.save();
  };

  client.updateProfile = async (user, settings: Object) => {
    /**
     * Takes a user and a object of settings
     * @param {user} @type user
     * @param {settings} @type Object
     */

    let data = await client.getProfile(user);

    if (typeof data !== 'object') data = {};
    for (const key in settings) {
      if (data[key] !== settings[key]) data[key] = settings[key];
      else return;
    }
    console.log(`Guild "${data.user}" (${data.userID}) updated settings: ${Object.keys(settings)}`);
    // eslint-disable-next-line consistent-return, no-return-await
    return await data.updateOne(settings);
  };
};
