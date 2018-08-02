/**
 * @file streamerRole command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

exports.exec = async (Bastion, message, args) => {
  try {
    let description = `No role in your server has been set as the streamer role. To set a role as the streamer role, run the command \`${this.help.name} [ROLE_ID]\`.`, color = Bastion.colors.RED;

    if (args.role) {
      if (parseInt(args.message) >= 9223372036854775807) {
        /**
         * The command was ran with invalid parameters.
         * @fires commandUsage
         */
        return Bastion.emit('commandUsage', message, this.help);
      }

      let role = message.guild.roles.get(args.role);
      if (!role) {
        /**
         * Error condition is encountered.
         * @fires error
         */
        return Bastion.emit('error', '', Bastion.i18n.error(message.guild.language, 'roleNotFound'), message.channel);
      }

      await Bastion.database.models.guild.update({
        streamerRole: role.id
      },
      {
        where: {
          guildID: message.guild.id
        },
        fields: [ 'streamerRole' ]
      });
      description = Bastion.i18n.info(message.guild.language, 'enableStreamerRole', message.author.tag, role.name);
      color = Bastion.colors.GREEN;
    }
    else if (args.remove) {
      await Bastion.database.models.guild.update({
        streamerRole: null
      },
      {
        where: {
          guildID: message.guild.id
        },
        fields: [ 'streamerRole' ]
      });
      description = Bastion.i18n.info(message.guild.language, 'disableStreamerRole', message.author.tag);
      color = Bastion.colors.RED;
    }
    else {
      let guildModel = await Bastion.database.models.guild.findOne({
        attributes: [ 'streamerRole' ],
        where: {
          guildID: message.guild.id
        }
      });
      if (guildModel.dataValues.streamerRole) {
        let streamerRole = message.guild.roles.get(guildModel.dataValues.streamerRole);
        if (streamerRole) {
          description = Bastion.i18n.info(message.guild.language, 'streamerRole', streamerRole.name);
          color = Bastion.colors.BLUE;
        }
      }
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
    { name: 'role', type: String, defaultOption: true },
    { name: 'remove', type: Boolean, alias: 'r' }
  ]
};

exports.help = {
  name: 'streamerRole',
  description: 'Adds a role as the streamer role. When a guild member (who is at least in a single role) starts streaming, they are given the streamer role.',
  botPermission: 'MANAGE_ROLES',
  userTextPermission: 'MANAGE_GUILD',
  userVoicePermission: '',
  usage: 'streamerRole [ROLE_ID] [--remove]',
  example: [ 'streamerRole', 'streamerRole 265419266104885248', 'streamerRole --remove' ]
};
