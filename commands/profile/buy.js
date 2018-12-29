/**
 * @file buy command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

exports.exec = async (Bastion, message, args) => {
  if (!args.index) {
    return Bastion.emit('commandUsage', message, this.help);
  }

  let user = message.author;
  if (args.gift) {
    user = await Bastion.utils.fetchMember(message.guild, args.gift);
    if (!user) {
      return message.client.emit('error', '', message.client.i18n.error(message.guild.language, 'notFound', 'player'), message.channel);
    }
    user = user.user;
  }

  let shopModel = await Bastion.database.models.shop.findOne({
    attributes: [ 'custom' ],
    where: {
      guildID: message.guild.id
    }
  });

  let itemsInShop;
  if (shopModel && shopModel.dataValues.custom) {
    itemsInShop = shopModel.dataValues.custom;
  }
  else {
    itemsInShop = [];
  }

  args.index = Math.abs(args.index);
  args.index = args.index - 1;

  if (args.index >= itemsInShop.length) {
    return Bastion.emit('error', '', Bastion.i18n.error(message.guild.language, 'indexRange'), message.channel);
  }

  // Check if user has sufficient balance
  let guildMemberModel = await Bastion.database.models.guildMember.findOne({
    attributes: [ 'bastionCurrencies' ],
    where: {
      userID: message.author.id,
      guildID: message.guild.id
    }
  });
  let userBalance = parseInt(guildMemberModel.dataValues.bastionCurrencies);

  if (userBalance < parseInt(itemsInShop[args.index].value)) {
    return Bastion.emit('error', '', Bastion.i18n.error(message.guild.language, 'insufficientBalance', userBalance), message.channel);
  }

  // Add item to user's item list
  let itemsModel = await Bastion.database.models.items.findOne({
    attributes: [ 'custom' ],
    where: {
      userID: user.id,
      guildID: message.guild.id
    }
  });

  let userItems;
  if (itemsModel && itemsModel.dataValues.custom) {
    userItems = itemsModel.dataValues.custom;
  }
  else {
    userItems = [];
  }

  userItems.push(itemsInShop[args.index].name);

  await Bastion.database.models.items.upsert({
    userID: user.id,
    guildID: message.guild.id,
    custom: userItems
  },
  {
    where: {
      userID: user.id,
      guildID: message.guild.id
    },
    fields: [ 'userID', 'guildID', 'custom' ]
  });

  // Transaction
  Bastion.emit('userCredit', message.member, itemsInShop[args.index].value);

  if (message.author.id !== message.guild.owner.id) {
    Bastion.emit('userDebit', message.guild.members.get(message.guild.owner.id), (0.9) * itemsInShop[args.index].value);
  }

  let buyMessage = `${message.author.tag} bought **${itemsInShop[args.index].name}** for **${itemsInShop[args.index].value}** Bastion Currencies.`;
  await message.channel.send({
    embed: {
      color: Bastion.colors.GREEN,
      description: args.gift
        ? `${buyMessage} And gifted it to **${user.tag}**.`
        : buyMessage
    }
  }).catch(e => {
    Bastion.log.error(e);
  });
};

exports.config = {
  aliases: [],
  enabled: true,
  argsDefinitions: [
    { name: 'index', type: Number, defaultOption: true },
    { name: 'gift', type: String }
  ]
};

exports.help = {
  name: 'buy',
  description: 'Buy items from the server\'s shop. You can also gift it to some other member while buying.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'buy <ITEM_INDEX> [--gift USER_ID]',
  example: [ 'buy 1', 'buy 3 --gift 266290969974931457' ]
};
