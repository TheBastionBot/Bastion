/**
 * @file warnAction command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
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

    let guildModel = await message.client.database.models.guild.findOne({
      attributes: [ 'warnAction' ],
      where: {
        guildID: message.guild.id
      }
    });

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

    if (guildModel.dataValues.warnAction === warnAction) {
      color = Bastion.colors.RED;
      description = `Warn action is already set to ${warnAction ? warnAction : 'none'}.`;
    }
    else {
      await message.client.database.models.guild.update({
        warnAction: warnAction
      },
      {
        where: {
          guildID: message.guild.id
        },
        fields: [ 'warnAction' ]
      });
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
  description: 'Sets the warn action for the server.',
  botPermission: '',
  userTextPermission: 'BAN_MEMBERS',
  userVoicePermission: '',
  usage: 'warnAction < --kick | --softban | --ban | --none >',
  example: [ 'warnAction --kick', 'warnAction --none' ]
};
