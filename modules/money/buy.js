/**
 * @file buy command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.exec = async (Bastion, message, args) => {
  try {
    if (!args.index) {
      /**
      * The command was ran with invalid parameters.
      * @fires commandUsage
      */
      return Bastion.emit('commandUsage', message, this.help);
    }

    let guildShop = await message.client.db.get(`SELECT custom FROM guildShop WHERE guildID=${message.guild.id}`);

    let itemsInShop;
    if (guildShop && guildShop.custom) {
      itemsInShop = await Bastion.functions.decodeString(guildShop.custom);
      itemsInShop = JSON.parse(itemsInShop);
    }
    else {
      itemsInShop = [];
    }

    args.index = Math.abs(args.index);
    args.index = args.index - 1;

    if (args.index > itemsInShop.length) {
      return Bastion.emit('error', Bastion.strings.error(message.guild.language, 'notFound'), Bastion.strings.error(message.guild.language, 'indexRange', true), message.channel);
    }

    // Check if user has sufficient balance
    let userProfile = await Bastion.db.get(`SELECT bastionCurrencies FROM profiles WHERE userID='${message.author.id}'`);
    let userBalance = parseInt(userProfile.bastionCurrencies);

    if (userBalance < parseInt(itemsInShop[args.index].value)) {
      return Bastion.emit('error', Bastion.strings.error(message.guild.language, 'insufficientBalance'), Bastion.strings.error(message.guild.language, 'insufficientBalance', true, userBalance), message.channel);
    }

    // Add item to user's item list
    let userItems = await Bastion.db.get(`SELECT custom_items FROM shop_items WHERE userID='${message.author.id}' AND guildID='${message.guild.id}'`);
    if (userItems && userItems.custom_items) {
      userItems = await Bastion.functions.decodeString(userItems.custom_items);
      userItems = JSON.parse(userItems);
    }
    else {
      userItems = [];
    }

    userItems.push(itemsInShop[args.index].name);
    userItems = JSON.stringify(userItems);
    userItems = await Bastion.functions.encodeString(userItems);

    await Bastion.db.run('INSERT OR REPLACE INTO shop_items (userID, guildID, custom_items) VALUES(?, ?, ?)', [ message.author.id, message.guild.id, userItems ]);

    // Transaction
    Bastion.emit('userCredit', message.author, itemsInShop[args.index].value);

    if (message.author.id !== message.guild.owner.id) {
      Bastion.emit('userDebit', message.guild.owner, (0.9) * itemsInShop[args.index].value);
    }

    message.channel.send({
      embed: {
        color: Bastion.colors.GREEN,
        description: `${message.author.tag} bought **${itemsInShop[args.index].name}** for **${itemsInShop[args.index].value}** Bastion Currencies.`
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
    { name: 'index', type: Number, defaultOption: true }
  ]
};

exports.help = {
  name: 'buy',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'buy <ITEM_INDEX>',
  example: [ 'buy 3' ]
};
