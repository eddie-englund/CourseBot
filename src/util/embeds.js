const embed = client => {
    const today = new Date();

    client.dailyEmbed = user => {
        const newEmbed = client.util
            .embed()
            .setColor(client.color.main)
            .setAuthor(user.tag, user.displayAvatarURL())
            .setDescription([`${user.tag}, You've gained gained 100 💵`])
            .setTimestamp(today);

        return newEmbed;
    };
};
module.exports = embed;
