/**
 * @file shop command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

exports.exec = async (Bastion, message, args) => {
  try {
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

    if (args.add && args.item) {
      if (!message.member || !message.member.hasPermission('MANAGE_GUILD')) {
        return message.client.emit('userMissingPermissions', 'MANAGE_GUILD');
      }

      if (itemsInShop.length >= 25) {
        return Bastion.emit('error', '', 'You can\'t add more than 25 items for sale.', message.channel);
      }

      args.add = Math.abs(args.add);

      args.item = args.item.join(' ');

      if (args.item.length > 25) {
        return Bastion.emit('error', '', 'Name of the item should be less than 25 characters.', message.channel);
      }

      itemsInShop.push({
        name: args.item,
        value: args.add
      });

      await Bastion.database.models.shop.upsert({
        guildID: message.guild.id,
        custom: itemsInShop
      },
      {
        where: {
          guildID: message.guild.id
        },
        fields: [ 'guildID', 'custom' ]
      });

      message.channel.send({
        embed: {
          color: Bastion.colors.GREEN,
          description: `Listed **${args.item}** for sale in the Shop for **${args.add}** Bastion Currencies.`
        }
      }).catch(e => {
        Bastion.log.error(e);
      });
    }
    else if (args.remove) {
      if (!message.member || !message.member.hasPermission('MANAGE_GUILD')) {
        return message.client.emit('userMissingPermissions', 'MANAGE_GUILD');
      }

      args.remove = Math.abs(args.remove);

      if (args.remove > itemsInShop.length) {
        return Bastion.emit('error', '', Bastion.i18n.error(message.guild.language, 'indexRange'), message.channel);
      }

      let deletedItem = itemsInShop.splice(args.remove - 1, 1);

      await Bastion.database.models.shop.upsert({
        guildID: message.guild.id,
        custom: itemsInShop
      },
      {
        where: {
          guildID: message.guild.id
        },
        fields: [ 'guildID', 'custom' ]
      });

      message.channel.send({
        embed: {
          color: Bastion.colors.RED,
          description: `Unlisted **${deletedItem[0].name}** from the Shop.`
        }
      }).catch(e => {
        Bastion.log.error(e);
      });
    }
    else {
      if (itemsInShop.length) {
        itemsInShop = itemsInShop.map((item, i) => {
          return {
            name: `${i + 1}. ${item.name}`,
            value: `${item.value} Bastion Currencies`,
            inline: true
          };
        });

        message.channel.send({
          embed: {
            color: Bastion.colors.BLUE,
            title: 'Shop',
            description: 'Buy any item using the `buy` command.\nUse `help buy` command for more info.',
            fields: itemsInShop
          }
        }).catch(e => {
          Bastion.log.error(e);
        });
      }
      else {
        message.channel.send({
          embed: {
            color: Bastion.colors.RED,
            title: 'Shop',
            description: 'No item\'s for sale in this server at this time.'
          }
        }).catch(e => {
          Bastion.log.error(e);
        });
      }
    }
  }
  catch (e) {
    Bastion.log.error(e);
  }
};

exports.config = {
  aliases: [ 'store' ],
  enabled: true,
  argsDefinitions: [
    { name: 'item', type: String, multiple: true, defaultOption: true },
    { name: 'add', type: Number, alias: 'a' },
    { name: 'remove', type: Number, alias: 'r' }
  ]
};

exports.help = {
  name: 'shop',
  description: 'Lists/Adds/Removes items from your server\'s shop. Listed items in the shop can be bought by anyone, with %currency.name_plural%, in your server using the `buy` command. When users buy item, the server owner gets 90% of the profit.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'shop [ --add AMOUNT ITEM_NAME | --remove ITEM_INDEX ]',
  example: [ 'shop', 'shop --add 100 The Coolest Hoodie', 'shop --remove 2' ]
};
