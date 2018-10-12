/**
 * @file ignoreInviteFilter command
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
        ignoreInviteFilter: !args.remove
      },
      {
        where: {
          channelID: args.channel.id,
          guildID: message.guild.id
        },
        fields: [ 'ignoreInviteFilter' ]
      });

      let description;
      if (args.remove) {
        description = `Removed the ${args.channel} text channel from the invite filter ignore list.`;
      }
      else {
        description = `Added the ${args.channel} text channel to the invite filter ignore list.`;
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
        ignoreInviteFilter: !args.remove
      },
      {
        where: {
          roleID: args.role.id,
          guildID: message.guild.id
        },
        fields: [ 'ignoreInviteFilter' ]
      });

      let description;
      if (args.remove) {
        description = `Removed the ${args.role} role from the invite filter ignore list.`;
      }
      else {
        description = `Added the ${args.role} role to the invite filter ignore list.`;
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
          ignoreInviteFilter: true
        }
      });

      let ignoredChannels = 'No channels are being ignored by invite filter.';
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
          ignoreInviteFilter: true
        }
      });

      let ignoredRoles = 'No roles are being ignored by invite filter.';
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
          title: 'Invite Filter Ignored List',
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
  name: 'ignoreInviteFilter',
  description: 'Add/remove channels/roles to/from the invite filter ignored list. Bastion will not filter invites posted in these channels or by these roles.',
  botPermission: '',
  userTextPermission: 'MANAGE_GUILD',
  userVoicePermission: '',
  usage: 'ignoreInviteFilter [--channel #CHANNEL_MENTION | CHANNEL_ID] [--role ROLE_ID] [--remove]',
  example: []
};
