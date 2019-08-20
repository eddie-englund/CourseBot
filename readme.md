<img src="https://yt3.ggpht.com/a/AGF-l7-o7kerdDSATMKwSTOyOznS6OM5-2JCcvDt1g=s288-c-k-c0xffffffff-no-rj-mo" width="100" height="100" align="left" style="float: left; margin: 0 10px 0 0; border-radius: 10%;" alt="Runa" >

# Course bot

> This bot is currently not invitable

<div align="center">
<a href="https://discord.gg/AtzDNFB">
    <img src="https://img.shields.io/discord/446312668823814145.svg?colorB=Blue&logo=discord&label=Support&style=for-the-badge">
</a>
<a href="https://app.codacy.com/app/TitusEntertainment/CourseBot?utm_source=github.com&utm_medium=referral&utm_content=TitusEntertainment/CourseBot&utm_campaign=Badge_Grade_Dashboard">
<img src="https://img.shields.io/codacy/grade/183d13ed5a064312b0bc7748f772755b.svg?style=for-the-badge">
</a>
<a href="https://github.com/TitusEntertainment/Coursebot">
    <img src="https://img.shields.io/github/languages/top/TitusEntertainment/CourseBot.svg?style=for-the-badge">
</a>
</div>

Course is the inhouse Discord bot developed specificly for the needs that we as moderators have found while moderating our Discord server called DesignCourse(courestro)

## Self hosting

To selfhost you will need the following:

- [nodejs](https://nodejs.org)
- [git](https://git-scm.com/)

**Step 1**

open a terminal and execute this command:

        git clone https://github.com/Titusentertainment/CourseBot.git

**Step 2**

cd into that directory

    cd CourseBot

create a file called .env in the root foder this can be done with the command bellow (if your terminal allows it), if that does not work do it manually.

        touch .env

**Step 3**

Open that file and paste in your token and your discord user id. Your file should look like this:

        TOKEN = WHATEVERMYTOKENIS
        ownerID = MYDISCORID

**Step 4**

install all the dependencies.

        npm i

or if you use yarn

        yarn install

**Step 5**

run the command:

        npm run compile

or of if you use yarn

        yarn run compile

This will compile the code for you.

**Step 6**

install pm2

        npm i -G pm2

or if you use yarn

         yarn global add pm2 --prefix /usr/local

**FINAL STEP**

run the command:

        cd dist/bot/

and then run

        pm2 bot.js

if the bot does not start now make sure to double check all the previous steps.

## Commands

### Docs

**Frameworks:** with this command you can get the link to the documentation for several large frameworks, like vue and react.

**Mdn:** with this command you can quickly search mdn for anything!

**Npm:** allows you to search for npm pacakges!

### Economy

**Daily:** quite explanitory but it gives a user x amount of credits and can only be used once a day by the same user.

**Pay:** allows user x to pay user y a specified amount of credits

### Info

**Channel:** sends live data from the [DesignCourse(coursetro)](https://www.youtube.com/user/DesignCourse) youtube channel

**Guild:** sends information about the current guild.

**Help:** quite explanitory but it sends a list of commands or a detailed list for a specified command.

**Profile:** sends information about that users digital profile. Includes such as userID and the amount of credits that user has

### Moderation

**Ban:** bans a specified user, clears two days worth of content sent by that user and allows the moderator to specify a reason for why they banned the specified user.

**Kick:** kicks a specified user and like the commands above it allows the moderator to specify a reason.

**Unban:** unbans a banned user, and allows moderator to specify a reason. `Needs a valid userID to execute`

**Warn:** warns a specified user and allows moderator to specify a reason.

### SettingsRuna

**Init:** creates a database instance for that guild. `note that this command is just a fail safe in case something went wrong in the process`.

**log:** allows user to either start or stop logging. `note that logging is by default turned off`

**Channel:** allows user to specify what channel the bot should log to. `by default the bot will try to log to a channel with the name "modlogs"`

**Prefix:** allows user the specify what prefix the bot should respond to in that specific guild.

### Tags

`note: to use any of these commands the syntax is <prefix>tag <command>`

**Add:** adds a tag.

**Delete:** deletes a specified tag.

**Edit:** edits a specified tag.

**List:** sends a list of all tags.

**Show:** shows a specifed tag.

## Related links.

- **[DesignCourse(coursetro)](https://www.youtube.com/user/DesignCourse) -** `Gary Simons youtube channel.`

- **[Titania Mothership](https://www.youtube.com/channel/UCDyNFENFWUR3SE8BOnUF2WA) -** `My tutorial and development youtube channel.`

- **[Discord](https://discord.gg/AtzDNFB) -** `The DesignCourse(courestro) Discord server.`

- **[Discord.js](https://discord.js.org) -** `The api wrapper.`

- **[Discord-akairo](https://discord-akairo.github.io/#/) -** `The framework used.`

## Author

<img src="https://i.imgur.com/rAvP1k0.jpg" width="100" height="100" align="left" style="float: left; margin: 0 10px 0 0;" alt="Titus avatar" >

**Runa** © [Titus](https://github.com/TitusEntertainment).  
Authored and maintained by Titus.

> GitHub [@TitusEntertainment](https://github.com/TitusEntertainment)
