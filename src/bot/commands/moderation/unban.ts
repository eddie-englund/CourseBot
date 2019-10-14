import { Command } from 'discord-akairo';
import { CourseClient } from '../../client/CourseClient';
import { Message, User, MessageEmbed } from 'discord.js';

export default class Unban extends Command {
  public client: CourseClient;

  public constructor() {
    super('unban', {
      aliases: ['unban', 'deban'],
      clientPermissions: ['BAN_MEMBERS', 'SEND_MESSAGES'],
      userPermissions: ['BAN_MEMBERS'],
      category: 'moderation',
      description: {
        content: 'Unbans a user. Note: you need to provide a valid userID for this command to work!',
        usage: '<USERID> <reason>',
        examples: ['<userid> <reason>'],
      },
      channel: 'guild',
      args: [
        {
          id: 'user',
          type: async (_, id): Promise<User> => {
            const user = await this.client.users.fetch(id);
            return user;
          },
          prompt: {
            start: (message: Message): string => `${message.author}, who would you like to unban?`,
            retry: (message: Message): string => `${message.author}, please provide a valid user reslovable.`,
          },
        },
        {
          id: 'reason',
          match: 'rest',
          default: 'no reason provided',
        },
      ],
    });
  }

  public async exec(message: Message, { user, reason }: { user: User; reason: string }) {
    if (user.id === message.author!.id) return message.reply('Why in gods name are you trying to unban yourself?');

    try {
      await message.guild!.members.unban(user, `Unbanned by ${message.author!.tag}`);
      await this.client.db.NewCase(message, 'unban', user, reason);
    } catch (error) {
      this.client.logger.error(error);
      return message.reply(`there was an error unbanning this user: \`${error.message}\``);
    }

    const unbanEmbed: MessageEmbed = new MessageEmbed()
      .setColor(this.client.color.main)
      .setAuthor(message.author.tag, message.author.displayAvatarURL())
      .setDescription(`User ${message.author.tag} has unbanned user ${user}. The reason was: ${reason}`)
      .setTimestamp(Date.now());

    await this.client.guildLog(message, unbanEmbed);
    return message.util!.send(unbanEmbed);
  }
}
