/**
 * @file deleteChannel command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

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
      return message.channel.send({
        embed: {
          color: Bastion.colors.red,
          description: 'I didn\'t find any channels with the given ID/name.'
        }
      }).catch(e => {
        Bastion.log.error(e.stack);
      });
    }
  }

  if (!channel.permissionsFor(message.member).has(this.help.userPermission)) {
    return Bastion.emit('userMissingPermissions', this.help.userPermission);
  }
  if (!channel.permissionsFor(message.guild.me).has(this.help.botPermission)) {
    return Bastion.emit('bastionMissingPermissions', this.help.botPermission, message);
  }

  if (channel.id === message.guild.defaultChannel.id) {
    return message.channel.send({
      embed: {
        color: Bastion.colors.red,
        description: 'I can\'t delete the default text channel of this server.'
      }
    }).catch(e => {
      Bastion.log.error(e.stack);
    });
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
        Bastion.log.error(e.stack);
      });
    }
  }).catch(e => {
    Bastion.log.error(e.stack);
  });
};

exports.config = {
  aliases: [ 'dc' ],
  enabled: true,
  argsDefinitions: [
    { name: 'mention', type: String, alias: 'm', defaultOption: true },
    { name: 'id', type: String, alias: 'i' },
    { name: 'name', type: String, alias: 'n', multiple: true }
  ]
};

exports.help = {
  name: 'deletechannel',
  description: 'Deletes a mentioned text channel. If no channel is mentioned, deletes the current text channel.',
  botPermission: 'MANAGE_CHANNELS',
  userPermission: 'MANAGE_CHANNELS',
  usage: 'deleteChannel [ [-m] #channel-mention | -i CHANNEL_ID | -n Channel Name ]',
  example: [ 'deleteChannel -m #channel-name', 'deleteChannel -i 298889698368028672', 'deleteChannel -n Control Room' ]
};
