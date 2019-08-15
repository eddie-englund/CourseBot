import { Command } from 'discord-akairo';
import CourseClient from 'src/bot/client/CourseClient';
import { Message, User, MessageEmbed } from 'discord.js';

export default class Unban extends Command {
  client: CourseClient;

  constructor() {
    super('unban', {
      aliases: ['unban', 'deban'],
      clientPermissions: ['BAN_MEMBERS', 'SEND_MESSAGES'],
      userPermissions: ['BAN_MEMBERS'],
      channel: 'guild',
      args: [
        {
          id: 'user',
          type: async (_, id): Promise<User> => {
            const user = await this.client.users.fetch(id);
            return user;
          },
          prompt: {
            start: (message: Message): string =>
              `${message.author}, who would you like to unban?`,
            retry: (message: Message): string =>
              `${message.author}, please provide a valid user reslovable.`
          }
        },
        {
          id: 'reason',
          match: 'rest'
        }
      ]
    });
  }

  public async exec(message: Message, { user, reason }: { user: User; reason: string }) {
    if (user.id === message.author!.id)
      return message.reply('Why in gods name are you trying to unban yourself?');

    try {
      await message.guild!.members.unban(user, `Unbanned by ${message.author!.tag}`);
    } catch (error) {
      return message.reply(
        `there was an error unbanning this user: \`${error.message}\``
      );
    }

    const unbanEmbed: MessageEmbed = this.client.util
      .embed()
      .setColor(this.client.color.main)
      .setAuthor(message.author.tag, message.author.displayAvatarURL())
      .setDescription(
        `User ${message.author.tag} has unbanned user ${user}. The reason was: ${reason}`
      )
      .setTimestamp(Date.now());

    await this.client.log(message, unbanEmbed);
    return message.util!.send(unbanEmbed);
  }
}
