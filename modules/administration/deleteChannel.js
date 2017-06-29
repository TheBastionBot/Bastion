/**
 * @file deleteChannel command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const string = require('../../handlers/languageHandler');

exports.run = (Bastion, message, args) => {
  let channel = message.mentions.channels.first();
  if (!channel) {
    channel = message.channel;
    if (args.id) {
      channel = message.guild.channels.get(args.id);
    }
    else if (args.name) {
      channel = message.guild.channels.find('name', args.name.join(' '));
    }
    if (!channel) {
      /**
       * Error condition is encountered.
       * @fires error
       */
      return Bastion.emit('error', string('notFound', 'errors'), string('channelNotFound', 'errorMessage'), message.channel);
    }
  }

  if (!channel.permissionsFor(message.member).has(this.help.userPermission)) {
    /**
     * User has missing permissions.
     * @fires userMissingPermissions
     */
    return Bastion.emit('userMissingPermissions', this.help.userPermission);
  }
  if (!channel.permissionsFor(message.guild.me).has(this.help.botPermission)) {
    /**
     * Bastion has missing permissions.
     * @fires bastionMissingPermissions
     */
    return Bastion.emit('bastionMissingPermissions', this.help.botPermission, message);
  }

  if (channel.id === message.guild.defaultChannel.id) {
    /**
     * Error condition is encountered.
     * @fires error
     */
    return Bastion.emit('error', string('forbidden', 'errors'), string('deleteDefaultChannel', 'errorMessage'), message.channel);
  }

  channel.delete().then(() => {
    if (channel.id !== message.channel.id) {
      message.channel.send({
        embed: {
          color: Bastion.colors.red,
          title: 'Channel Deleted',
          fields: [
            {
              name: 'Channel Name',
              value: channel.name,
              inline: true
            },
            {
              name: 'Channel ID',
              value: channel.id,
              inline: true
            },
            {
              name: 'Channel Type',
              value: channel.type.toUpperCase(),
              inline: true
            }
          ]
        }
      }).catch(e => {
        Bastion.log.error(e);
      });
    }
  }).catch(e => {
    Bastion.log.error(e);
  });
};

exports.config = {
  aliases: [ 'deletec' ],
  enabled: true,
  argsDefinitions: [
    { name: 'mention', type: String, alias: 'm', defaultOption: true },
    { name: 'id', type: String, alias: 'i' },
    { name: 'name', type: String, alias: 'n', multiple: true }
  ]
};

exports.help = {
  name: 'deletechannel',
  description: string('deleteChannel', 'commandDescription'),
  botPermission: 'MANAGE_CHANNELS',
  userPermission: 'MANAGE_CHANNELS',
  usage: 'deleteChannel [ [-m] #channel-mention | -i CHANNEL_ID | -n Channel Name ]',
  example: [ 'deleteChannel -m #channel-name', 'deleteChannel -i 298889698368028672', 'deleteChannel -n Control Room' ]
};
