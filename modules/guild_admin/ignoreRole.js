/**
 * @file ignoreRole command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.exec = async (Bastion, message, args) => {
  try {
    if (!args.id) {
      /**
      * The command was ran with invalid parameters.
      * @fires commandUsage
      */
      return Bastion.emit('commandUsage', message, this.help);
    }

    if (!message.guild.roles.get(args.id)) {
      /**
      * Error condition is encountered.
      * @fires error
      */
      return Bastion.emit('error', Bastion.strings.error(message.guild.language, 'notFound'), Bastion.strings.error(message.guild.language, 'roleNotFound', true), message.channel);
    }

    let guildSettings = await Bastion.db.get(`SELECT ignoredRoles FROM guildSettings WHERE guildID=${message.guild.id}`);
    let ignoredRoles = guildSettings.ignoredRoles, isIgnored = false,
      description = null, color = Bastion.colors.RED;

    if (ignoredRoles) {
      ignoredRoles = ignoredRoles.split(' ');
      if (ignoredRoles.includes(args.id)) {
        isIgnored = true;
      }
    }
    else {
      ignoredRoles = [];
    }

    if (isIgnored) {
      if (args.remove) {
        ignoredRoles.splice(ignoredRoles.indexOf(args.id), 1);
        color = Bastion.colors.GREEN;
        description = 'I\'ll stop ignoring commands from this role, from now.';
      }
      else {
        description = 'I\'m already ignoring commands from this role.';
      }
    }
    else {
      if (args.remove) {
        description = 'I\'m already accepting commands from this role.';
      }
      else {
        ignoredRoles.push(args.id);
        color = Bastion.colors.GREEN;
        description = 'I\'ll ignore commands from this role, from now.';
      }
    }
    ignoredRoles = ignoredRoles.join(' ');

    await Bastion.db.run(`UPDATE guildSettings SET ignoredRoles='${ignoredRoles}' WHERE guildID=${message.guild.id}`);

    message.channel.send({
      embed: {
        color: color,
        description: description
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
    { name: 'id', type: String, defaultOption: true },
    { name: 'remove', type: Boolean, alias: 'r' }
  ]
};

exports.help = {
  name: 'ignoreRole',
  botPermission: '',
  userTextPermission: 'MANAGE_GUILD',
  userVoicePermission: '',
  usage: 'ignoreRole <ROLE_ID> [--remove]',
  example: [ 'ignoreRole 295982817647788032', 'ignoreRole 295982817647788032 --remove' ]
};
