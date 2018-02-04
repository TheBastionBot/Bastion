/**
 * @file buyGift command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.exec = async (Bastion, message, args) => {
  try {
    if (!args.product) {
      /**
      * The command was ran with invalid parameters.
      * @fires commandUsage
      */
      return Bastion.emit('commandUsage', message, this.help);
    }

    if (/choco(?:late)?[-_ ]?(?:bar)?[s]?/i.test(args.product)) {
      args.product = 'chocolate_bar';
    }
    else if (/ice[-_ ]?cream[s]?/i.test(args.product)) {
      args.product = 'icecream';
    }
    else if (/cookie[s]?/i.test(args.product)) {
      args.product = 'cookie';
    }
    else if (/cake[s]?/i.test(args.product)) {
      args.product = 'cake';
    }
    else if (/ring[s]?/i.test(args.product)) {
      args.product = 'ring';
    }
    else if (/crown[s]?/i.test(args.product)) {
      args.product = 'crown';
    }
    else if (/gem[s]?/i.test(args.product)) {
      args.product = 'gem';
    }
    else if (/heart[s]?/i.test(args.product)) {
      args.product = 'gift_heart';
    }
    else if (/love[-_ ]?letter[s]?/i.test(args.product)) {
      args.product = 'love_letter';
    }
    else {
      return Bastion.emit('error', Bastion.strings.error(message.guild.language, 'notFound'), 'The specified product was not found in the gift shop. To check the available products, run `giftShop` command.', message.channel);
    }

    let gifts = {
      chocolate_bar: [ '🍫  Chocolate Bar', 20 ],
      icecream: [ '🍦  Ice Cream', 10 ],
      cookie: [ '🍪  Cookie', 5 ],
      cake: [ '🍰  Cake', 20 ],
      ring: [ '💍  Ring', 250 ],
      crown: [ '👑  Crown', 500 ],
      gem: [ '💎  Gem', 100 ],
      gift_heart: [ '💝  Heart', 50 ],
      love_letter: [ '💌  Love Letter', 5 ]
    };

    let userProfile = await Bastion.db.get(`SELECT bastionCurrencies FROM profiles WHERE userID='${message.author.id}'`);
    let userBalance = parseInt(userProfile.bastionCurrencies);
    let requiredBalance = gifts[args.product][1] * args.amount;

    if (userBalance < requiredBalance) {
      return Bastion.emit('error', Bastion.strings.error(message.guild.language, 'insufficientBalance'), Bastion.strings.error(message.guild.language, 'insufficientBalance', true, userBalance), message.channel);
    }

    Bastion.emit('userCredit', message.author, requiredBalance);

    let userGifts = await Bastion.db.get(`SELECT ${args.product}s FROM gifts WHERE userID='${message.author.id}'`);
    if (!userGifts) {
      await Bastion.db.run(`INSERT OR IGNORE INTO gifts(userID, ${args.product}s) VALUES(${message.author.id}, ${args.amount})`);
    }
    else if (!userGifts[`${args.product}s`]) {
      await Bastion.db.run(`UPDATE gifts SET ${args.product}s='${args.amount}' WHERE userID='${message.author.id}'`);
    }
    else {
      await Bastion.db.run(`UPDATE gifts SET ${args.product}s='${parseInt(userGifts[`${args.product}s`]) + args.amount}' WHERE userID='${message.author.id}'`);
    }

    message.channel.send({
      embed: {
        color: Bastion.colors.GREEN,
        description: `${message.author.tag}, you successfully bought ${args.amount} ${gifts[args.product][0]} for ${requiredBalance} Bastion Currencies.`
      }
    }).catch(e => {
      Bastion.log.error(e);
    });
  }
  catch (e) {
    Bastion.log.error(e);
  }
};

exports.config = {
  aliases: [],
  enabled: true,
  argsDefinitions: [
    { name: 'product', type: String, multiple: true, defaultOption: true },
    { name: 'amount', type: Number, alias: 'a', defaultValue: 1 }
  ]
};

exports.help = {
  name: 'buyGift',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'buyGift <product> [-a amount]',
  example: [ 'buyGift icecream', 'buyGift chocolate -a 2' ]
};
