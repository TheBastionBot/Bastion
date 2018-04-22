/**
 * @file buyRole command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
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
      return Bastion.emit('error', Bastion.strings.error(message.guild.language, 'notFound'), Bastion.strings.error(message.guild.language, 'roleNotFound', true), message.channel);
    }

    let shopModel = await Bastion.database.models.shop.findOne({
      attributes: [ 'roles' ],
      where: {
        guildID: message.guild.id
      }
    });

    let rolesInStore;
    if (shopModel && shopModel.dataValues.roles) {
      rolesInStore = shopModel.dataValues.roles;
    }
    else {
      rolesInStore = {};
    }

    let buyableRoles = Object.keys(rolesInStore).filter(role => message.guild.roles.has(role));
    if (buyableRoles.includes(role.id)) {
      let guildMemberModel = await Bastion.database.models.guildMember.findOne({
        attributes: [ 'bastionCurrencies' ],
        where: {
          userID: message.author.id,
          guildID: message.guild.id
        }
      });
      guildMemberModel.dataValues.bastionCurrencies = parseInt(guildMemberModel.dataValues.bastionCurrencies);

      if (rolesInStore[role.id] > guildMemberModel.dataValues.bastionCurrencies) {
        return Bastion.emit('error', Bastion.strings.error(message.guild.language, 'insufficientBalance'), Bastion.strings.error(message.guild.language, 'insufficientBalance', true, guildMemberModel.dataValues.bastionCurrencies), message.channel);
      }

      message.member.addRole(role);

      Bastion.emit('userCredit', message.member, rolesInStore[role.id]);
      if (message.author.id !== message.guild.owner.id) {
        Bastion.emit('userDebit', message.guild.members.get(message.guild.owner.id), (0.9) * rolesInStore[role.id]);
      }

      message.channel.send({
        embed: {
          color: Bastion.colors.BLUE,
          description: `${message.author.tag} bought the **${role.name}** role for **${rolesInStore[role.id]}** Bastion Currencies.`
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
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'buyRole < ROLE NAME | ROLE_ID >',
  example: [ 'buyRole The Knights', 'buyRole 277132449585713251' ]
};
