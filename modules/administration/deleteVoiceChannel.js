/**
 * @file deleteVoiceChannel command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.run = (Bastion, message, args) => {
  if (args.length < 1) {
    return message.channel.send({
      embed: {
        color: Bastion.colors.yellow,
        title: 'Usage',
        description: `\`${Bastion.config.prefix}${this.help.usage}\``
      }
    }).catch(e => {
      Bastion.log.error(e.stack);
    });
  }

  let channel = message.guild.channels.filter(c => c.type === 'voice').find('name', args.join(' '));
  if (channel) {
    if (!channel.permissionsFor(message.member).has('MANAGE_CHANNELS')) return Bastion.log.info('User doesn\'t have permission to use this command.');
    if (!channel.permissionsFor(message.guild.me).has('MANAGE_CHANNELS')) {
      return message.channel.send({
        embed: {
          color: Bastion.colors.red,
          description: `I need **${this.help.botPermission}** permission, in this channel, to use this command.`
        }
      }).catch(e => {
        Bastion.log.error(e.stack);
      });
    }
  }
  else {
    return message.channel.send({
      embed: {
        color: Bastion.colors.red,
        description: 'No voice channel found with that name.'
      }
    }).catch(e => {
      Bastion.log.error(e.stack);
    });
  }

  channel.delete().catch(e => {
    Bastion.log.error(e.stack);
  });
};

exports.config = {
  aliases: [ 'dvc' ],
  enabled: true
};

exports.help = {
  name: 'deletevoicechannel',
  description: 'Deletes a voice channel by a given name.',
  botPermission: 'Manage Channels',
  userPermission: 'Manage Channels',
  usage: 'deleteVoiceChannel <Channel Name>',
  example: [ 'deleteVoiceChannel Voice Channel Name' ]
};
