/**
 * @file warnAction command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.exec = async (Bastion, message, args) => {
  try {
    if (Object.keys(args).length === 0) {
      /**
      * The command was ran with invalid parameters.
      * @fires commandUsage
      */
      return Bastion.emit('commandUsage', message, this.help);
    }

    let guildSettings = await Bastion.db.get(`SELECT warnAction FROM guildSettings WHERE guildID=${message.guild.id}`);
    let warnAction = '', color = Bastion.colors.GREEN, description;

    if (args.kick) {
      warnAction = 'kick';
    }
    else if (args.softban) {
      warnAction = 'softban';
    }
    else if (args.ban) {
      warnAction = 'ban';
    }

    if (guildSettings.warnAction === warnAction) {
      color = Bastion.colors.RED;
      description = `Warn action is already set to ${warnAction ? warnAction : 'none'}.`;
    }
    else {
      await Bastion.db.run(`UPDATE guildSettings SET warnAction='${warnAction}' WHERE guildID=${message.guild.id}`);
      description = `Warn action is now set to ${warnAction}.`;
    }

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
    { name: 'kick', type: Boolean, alias: 'k' },
    { name: 'softban', type: Boolean, alias: 's' },
    { name: 'ban', type: Boolean, alias: 'b' },
    { name: 'none', type: Boolean, alias: 'n' }
  ]
};

exports.help = {
  name: 'warnAction',
  botPermission: '',
  userTextPermission: 'BAN_MEMBERS',
  userVoicePermission: '',
  usage: 'warnAction < --kick | --softban | --ban | --none >',
  example: [ 'warnAction --kick', 'warnAction --none' ]
};
