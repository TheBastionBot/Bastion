/**
 * @file deleteTextChannel command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.run = (Bastion, message) => {
  let channel = message.mentions.channels.first();
  if (!channel) {
    channel = message.channel;
  }
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

  channel.delete().catch(e => {
    Bastion.log.error(e.stack);
  });
};

exports.config = {
  aliases: [ 'dtc' ],
  enabled: true
};

exports.help = {
  name: 'deletetextchannel',
  description: 'Deletes a mentioned text channel. If no channel is mentioned, deletes the current text channel.',
  botPermission: 'Manage Channels',
  userPermission: 'Manage Channels',
  usage: 'deleteTextChannel [#channel-mention]',
  example: [ 'deleteTextChannel #channel-name', 'deleteTextChannel' ]
};
