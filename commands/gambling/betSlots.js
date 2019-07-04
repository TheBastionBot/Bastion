/**
 * @file betSlots command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

let recentUsers = [];

exports.exec = async (Bastion, message, args) => {
  let cooldown = 60;

  if (recentUsers.includes(message.author.id)) {
    return Bastion.emit('error', '', Bastion.i18n.error(message.guild.language, 'gamblingCooldown', message.author, cooldown), message.channel);
  }

  if (!args.money || args.money < 1) {
    return Bastion.emit('commandUsage', message, this.help);
  }

  args.money = parseInt(args.money);

  let minAmount = 5;
  if (args.money < minAmount) {
    return Bastion.emit('error', '', Bastion.i18n.error(message.guild.language, 'minBet', minAmount), message.channel);
  }


  let guildMemberModel = await message.client.database.models.guildMember.findOne({
    attributes: [ 'bastionCurrencies' ],
    where: {
      userID: message.author.id,
      guildID: message.guild.id
    }
  });

  guildMemberModel.dataValues.bastionCurrencies = parseInt(guildMemberModel.dataValues.bastionCurrencies);

  if (args.money > guildMemberModel.dataValues.bastionCurrencies) {
    return Bastion.emit('error', '', Bastion.i18n.error(message.guild.language, 'insufficientBalance', guildMemberModel.dataValues.bastionCurrencies), message.channel);
  }

  recentUsers.push(message.author.id);


  let reel = [
    ':custard:',
    ':candy:',
    ':cake:',
    ':icecream:',
    ':lollipop:',
    ':chocolate_bar:',
    ':moneybag:',
    ':shaved_ice:',
    ':doughnut:',
    ':cookie:',
    ':ice_cream:'
  ];

  let reels = [];
  for (let i = 0; i < 3; i++) {
    reels.push(reel.getRandom());
  }

  let result = 'Sorry, you lost the bet. Better luck next time.';
  if (reels[0] === reels[1] && reels[1] === reels[2]) {
    let prize = args.money < 150 ? args.money * 2 : args.money < 500 ? args.money * 3 : args.money * 5;

    if (reels[0] === ':moneybag:') prize *= 2;

    result = `Congratulations! You won the bet.\nYou won **${prize}** Bastion Currencies.`;

    Bastion.emit('userDebit', message.member, prize);
  }
  else {
    result = 'Sorry, you lost the bet. Better luck next time.';

    Bastion.emit('userCredit', message.member, args.money);
  }

  setTimeout(() => {
    recentUsers.splice(recentUsers.indexOf(message.author.id), 1);
  }, cooldown * 60 * 1000);


  await message.channel.send({
    embed: {
      color: Bastion.colors.BLUE,
      title: 'Slot Machine',
      description: reels.join(' \u05C0 '),
      footer: {
        text: `🎰 ${result}`
      }
    }
  });
};

exports.config = {
  aliases: [],
  enabled: true,
  argsDefinitions: [
    { name: 'money', type: Number, alias: 'm' }
  ]
};

exports.help = {
  name: 'betSlots',
  description: 'Bet %currency.name_plural% on slot machine! You win if all 3 reels stop at the same emojis. There\'s also a grand prize if all 3 reels stop at :moneybag:!',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'betSlots <-m amount>',
  example: [ 'betSlots -m 100' ]
};
