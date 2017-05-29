/**
 * @file renameTextChannel command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.run = (Bastion, message, args) => {
  if (!message.channel.permissionsFor(message.member).has('MANAGE_CHANNELS')) return Bastion.log.info('User doesn\'t have permission to use this command.');
  if (!message.channel.permissionsFor(message.guild.me).has('MANAGE_CHANNELS')) {
    return message.channel.send({
      embed: {
        color: Bastion.colors.red,
        description: `I need **${this.help.botPermission}** permission, in this channel, to use this command.`
      }
    }).catch(e => {
      Bastion.log.error(e.stack);
    });
  }

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

  message.channel.setName(args.join('-')).then(() => {
    message.channel.send({
      embed: {
        color: Bastion.colors.yellow,
        title: 'Channel Name Changed',
        description: args.join('-')
      }
    }).catch(e => {
      Bastion.log.error(e.stack);
    });
  }).catch(e => {
    Bastion.log.error(e.stack);
  });
};

exports.config = {
  aliases: [ 'rtxtc' ],
  enabled: true
};

exports.help = {
  name: 'renametextchannel',
  description: 'Renames the current text channel to a given new name.',
  botPermission: 'Manage Channels',
  userPermission: 'Manage Channels',
  usage: 'renameTextChannel <Channel Name>',
  example: [ 'renameTextChannel New Channel Name' ]
};
