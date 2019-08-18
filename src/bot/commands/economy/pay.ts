import { Command } from 'discord-akairo';
import { Message } from 'discord.js';
import { CourseClient } from 'src/bot/client/CourseClient';
const ms = require('ms');

export class Pay extends Command {
  client: CourseClient;

  constructor() {
    super('pay', {
      aliases: ['pay'],
      ratelimit: 2,
      cooldown: ms('15 min'),
      category: 'economy',
      clientPermissions: ['SEND_MESSAGES'],
      userPermissions: ['SEND_MESSAGES'],
      channel: 'guild',
      args: [
        {
          id: 'payUser',
          type: 'member',
          prompt: {
            optional: false,
            start: message => `${message.author}, Who do you want to pay?`,
            retry: message => `${message.author}, Any day now...`,
          },
        },
        {
          id: 'amount',
          type: 'number',
          prompt: {
            optional: false,
            start: message => `${message.author}, How many credits would you like to pay?`,
            retry: message => `${message.author}, Please try again.`,
          },
        },
      ],
    });
  }

  public async exec(message: Message, { payUser, amount }) {
    const User = await this.client.getProfile(payUser.user);
    const Payee = await this.client.getProfile(message.author);

    if (!User) return message.reply('Something went wrong, please try again!');
    else if (!Payee) return message.reply(`You don't seem to have any money 🤔`);

    if (Payee.wallet.credits < amount) return message.reply(`💳 **|** You don't have ${amount} 💵`);
    const newPayeeCredits: Number = Payee.wallet.credits - amount;
    const tax = (10 / 100) * (User.wallet.credits + amount);
    const newUserCredits: Number = User.wallet.credits + amount - tax;

    await this.client.updateProfile(message.author, {
      wallet: { credits: newPayeeCredits },
    });
    await this.client.updateProfile(payUser.user, {
      wallet: { credits: newUserCredits },
    });
    await this.client.updateGuild(message.guild, {
      guildBank: {
        transactions: [
          {
            payee: {
              user: message.author.tag,
              userID: message.author.id,
              amount: amount,
            },
            userPaid: {
              user: payUser.user.tag,
              userID: payUser.user.id,
              amount: newUserCredits,
            },
          },
        ],
      },
    });

    const embed = this.client.util
      .embed()
      .setColor(this.client.color.main)
      .setAuthor(message.author.tag, message.author.displayAvatarURL())
      .setDescription(`${message.author.tag} has payed ${payUser.user.tag} ${amount}💵`)
      .setFooter('Guild taxes apply. Read more about taxes with the taxes command');
    return message.util!.send(embed);
  }
}
