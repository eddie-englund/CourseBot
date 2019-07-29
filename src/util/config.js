module.exports = {
    owner: process.env.ownerID,
    prefix: '!',
    defaultSettings: {
        prefix: '!',
        log: 'modlog',
        user: {
            username: String,
            userID: String,
            usertag: String,
            warnings: Number
        }
    }
};
