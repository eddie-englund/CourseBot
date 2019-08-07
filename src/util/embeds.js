const embed = client => {
    const today = new Date();

    client.dailyEmbed = user => {
        const newEmbed = client.util
            .embed()
            .setColor(client.color.main)
            .setAuthor(user.tag, user.displayAvatarURL())
            .setDescription([`${user.tag}, You've gained gained 25 💵`])
            .setTimestamp(today);

        return newEmbed;
    };

    client.prefixEmbed = (user, guild, prefix) => {
        const newEmbed = client.util
            .embed()
            .setColor(client.color.main)
            .setAuthor(user.tag, user.displayAvatarURL())
            .setThumbnail(guild.iconURL())
            .setDescription([
                '**2000 A new prefix has been set!**',
                '',
                `New prefix: \`\`${prefix}\`\``
            ])
            .setTimestamp(today);
        return newEmbed;
    };
};
module.exports = embed;
