/**
 * @file sellRole command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

exports.exec = async (Bastion, message, args) => {
  try {
    if (!args.role || !(args.price || args.remove)) {
      /**
       * The command was ran with invalid parameters.
       * @fires commandUsage
       */
      return Bastion.emit('commandUsage', message, this.help);
    }

    args.role = args.role.join(' ');

    let role;
    if (message.guild.roles.has(args.role)) {
      role = message.guild.roles.get(args.role);
    }
    else {
      role = message.guild.roles.find('name', args.role);
    }
    if (!role) {
      return Bastion.emit('error', '', Bastion.i18n.error(message.guild.language, 'roleNotFound'), message.channel);
    }

    if (args.remove) {
      await Bastion.database.models.role.update({
        price: null
      },
      {
        where: {
          roleID: role.id,
          guildID: message.guild.id
        },
        fields: [ 'price' ]
      });

      message.channel.send({
        embed: {
          color: Bastion.colors.RED,
          description: `Unlisted **${role}** role from the Role Store.`
        }
      }).catch(e => {
        Bastion.log.error(e);
      });
    }
    else {
      await Bastion.database.models.role.upsert({
        roleID: role.id,
        guildID: message.guild.id,
        price: Math.abs(args.price)
      },
      {
        where: {
          roleID: role.id,
          guildID: message.guild.id
        },
        fields: [ 'roleID', 'guildID', 'price' ]
      });

      message.channel.send({
        embed: {
          color: Bastion.colors.GREEN,
          description: `Listed **${role.name}** role for sale in the Role Store for **${args.price}** Bastion Currencies.`
        }
      }).catch(e => {
        Bastion.log.error(e);
      });
    }
  }
  catch (e) {
    Bastion.log.error(e);
  }
};

exports.config = {
  aliases: [],
  enabled: true,
  argsDefinitions: [
    { name: 'role', type: String, multiple: true, defaultOption: true },
    { name: 'price', type: Number, alias: 'p' },
    { name: 'remove', type: Boolean, alias: 'r' }
  ]
};

exports.help = {
  name: 'sellRole',
  description: 'Sell roles in your server so that server members can buy them with %currency.name_plural%, using the `buyRole` command. When users buy roles, the server owner gets 90% of the profit.',
  botPermission: '',
  userTextPermission: 'MANAGE_GUILD',
  userVoicePermission: '',
  usage: 'sellRole < ROLE_ID | ROLE NAME > < -p PRICE | --remove >',
  example: [ 'sellRole 277132449585713251 -p 100', 'sellRole 277132449585713251 --remove' ]
};
