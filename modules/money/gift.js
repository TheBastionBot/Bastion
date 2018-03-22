/**
 * @file gift command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.exec = async (Bastion, message, args) => {
  try {
    let receiver = message.mentions.users.first();
    if (!args.product || !receiver) {
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

    args.amount = Math.abs(args.amount);

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

    // Check sender's gifts
    let senderGifts = await Bastion.db.get(`SELECT ${args.product}s FROM gifts WHERE userID='${message.author.id}'`);
    if (!senderGifts) {
      return Bastion.emit('error', 'Insufficient items', 'You don\'t have any gifts with you.', message.channel);
    }
    else if (!senderGifts[`${args.product}s`]) {
      return Bastion.emit('error', 'Insufficient items', `You don't have any ${gifts[args.product][0]} with you.`, message.channel);
    }

    let giftAmount = parseInt(senderGifts[`${args.product}s`]);
    if (giftAmount < args.amount) {
      return Bastion.emit('error', 'Insufficient items', `You only have ${giftAmount} ${gifts[args.product][0]}`, message.channel);
    }

    // Update receiver's gifts
    let receiverGifts = await Bastion.db.get(`SELECT ${args.product}s FROM gifts WHERE userID='${receiver.id}'`);
    if (!receiverGifts) {
      await Bastion.db.run(`INSERT OR IGNORE INTO gifts(userID, ${args.product}s) VALUES(${receiver.id}, ${args.amount})`);
    }
    else if (!receiverGifts[`${args.product}s`]) {
      await Bastion.db.run(`UPDATE gifts SET ${args.product}s='${args.amount}' WHERE userID='${receiver.id}'`);
    }
    else {
      await Bastion.db.run(`UPDATE gifts SET ${args.product}s='${parseInt(receiverGifts[`${args.product}s`]) + args.amount}' WHERE userID='${receiver.id}'`);
    }

    // Update sender's gifts
    await Bastion.db.run(`UPDATE gifts SET ${args.product}s='${giftAmount - args.amount}' WHERE userID='${message.author.id}'`);

    message.channel.send({
      embed: {
        color: Bastion.colors.BLUE,
        description: `${receiver.tag}, you received ${args.amount} ${gifts[args.product][0]} from ${message.author.tag}!`
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
  name: 'gift',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'gift <product> [-a amount] <@USER_MENTION>',
  example: [ 'gift icecream @user#0001', 'gift chocolate -a 2 @user#0001' ]
};
