/**
 * @file buyRole command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

exports.exec = async (Bastion, message, args) => {
  try {
    if (!args.role) {
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

    let roleModel = await Bastion.database.models.role.findOne({
      attributes: [ 'price' ],
      where: {
        roleID: role.id,
        guildID: message.guild.id,
        price: {
          [Bastion.database.Op.not]: null
        }
      }
    });

    if (roleModel) {
      let price = roleModel.dataValues.price;

      let guildMemberModel = await Bastion.database.models.guildMember.findOne({
        attributes: [ 'bastionCurrencies' ],
        where: {
          userID: message.author.id,
          guildID: message.guild.id
        }
      });
      guildMemberModel.dataValues.bastionCurrencies = parseInt(guildMemberModel.dataValues.bastionCurrencies);

      if (price > guildMemberModel.dataValues.bastionCurrencies) {
        return Bastion.emit('error', '', Bastion.i18n.error(message.guild.language, 'insufficientBalance', guildMemberModel.dataValues.bastionCurrencies), message.channel);
      }

      message.member.addRole(role);

      Bastion.emit('userCredit', message.member, price);
      if (message.author.id !== message.guild.owner.id) {
        Bastion.emit('userDebit', message.guild.members.get(message.guild.owner.id), (0.9) * price);
      }

      message.channel.send({
        embed: {
          color: Bastion.colors.BLUE,
          description: `${message.author.tag} bought the **${role.name}** role for **${price}** Bastion Currencies.`
        }
      }).catch(e => {
        Bastion.log.error(e);
      });
    }
    else {
      return Bastion.emit('error', 'Not for sale', `The **${role.name}** role is not for sale.`, message.channel);
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
    { name: 'role', type: String, multiple: true, defaultOption: true }
  ]
};

exports.help = {
  name: 'buyRole',
  description: 'Buy role from the server\'s Role Store.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'buyRole < ROLE NAME | ROLE_ID >',
  example: [ 'buyRole The Knights', 'buyRole 277132449585713251' ]
};
