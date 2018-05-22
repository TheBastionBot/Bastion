/**
 * @file ignoreSlowMode command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

exports.exec = async (Bastion, message, args) => {
  try {
    if (args.channel) {
      args.channel = message.mentions.channels.size
        ? message.mentions.channels.first()
        : message.guild.channels.get(args.channel);

      if (!args.channel) {
        return Bastion.emit('error', '', Bastion.i18n.error(message.guild.language, 'channelNotFound'), message.channel);
      }

      await Bastion.database.models.textChannel.upsert({
        channelID: args.channel.id,
        guildID: message.guild.id,
        ignoreSlowMode: !args.remove
      },
      {
        where: {
          channelID: args.channel.id,
          guildID: message.guild.id
        },
        fields: [ 'ignoreSlowMode' ]
      });

      let description;
      if (args.remove) {
        description = `Removed the ${args.channel} text channel from the slow mode ignore list.`;
      }
      else {
        description = `Added the ${args.channel} text channel to the slow mode ignore list.`;
      }
      message.channel.send({
        embed: {
          color: Bastion.colors.BLUE,
          description: description
        }
      }).catch(e => {
        Bastion.log.error(e);
      });
    }
    else if (args.role) {
      args.role = message.guild.roles.get(args.role);

      if (!args.role) {
        return Bastion.emit('error', '', Bastion.i18n.error(message.guild.language, 'roleNotFound'), message.channel);
      }

      await Bastion.database.models.role.upsert({
        roleID: args.role.id,
        guildID: message.guild.id,
        ignoreSlowMode: !args.remove
      },
      {
        where: {
          roleID: args.role.id,
          guildID: message.guild.id
        },
        fields: [ 'ignoreSlowMode' ]
      });

      let description;
      if (args.remove) {
        description = `Removed the ${args.role} role from the slow mode ignore list.`;
      }
      else {
        description = `Added the ${args.role} role to the slow mode ignore list.`;
      }
      message.channel.send({
        embed: {
          color: Bastion.colors.BLUE,
          description: description
        }
      }).catch(e => {
        Bastion.log.error(e);
      });
    }
    else {
      let fields = [];

      let textChannelModel = await Bastion.database.models.textChannel.findAll({
        attributes: [ 'channelID' ],
        where: {
          guildID: message.guild.id,
          ignoreSlowMode: true
        }
      });

      let ignoredChannels = 'No channels are being ignored by slow mode.';
      if (textChannelModel.length) {
        ignoredChannels = `<#${textChannelModel.map(model => model.dataValues.channelID).join('>\n<#')}>`;
      }
      fields.push({
        name: 'Ignored Channels',
        value: ignoredChannels
      });

      let roleModel = await Bastion.database.models.role.findAll({
        attributes: [ 'roleID' ],
        where: {
          guildID: message.guild.id,
          ignoreSlowMode: true
        }
      });

      let ignoredRoles = 'No roles are being ignored by slow mode.';
      if (roleModel.length) {
        ignoredRoles = `<@&${roleModel.map(model => model.dataValues.roleID).join('>\n<@&')}>`;
      }
      fields.push({
        name: 'Ignored Roles',
        value: ignoredRoles
      });

      message.channel.send({
        embed: {
          color: Bastion.colors.BLUE,
          title: 'Slow Mode Ignored List',
          fields: fields
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
    { name: 'channel', type: String, defaultOption: true },
    { name: 'role', type: String },
    { name: 'remove', type: Boolean, alias: 'r' }
  ]
};

exports.help = {
  name: 'ignoreSlowMode',
  description: 'Add/remove channels/roles to/from the slow mode ignored list. Bastion will not enable slow mode in these channels or for these roles.',
  botPermission: '',
  userTextPermission: 'MANAGE_GUILD',
  userVoicePermission: '',
  usage: 'ignoreSlowMode [--channel #CHANNEL_MENTION | CHANNEL_ID] [--role ROLE_ID] [--remove]',
  example: []
};
