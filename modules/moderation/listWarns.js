/**
 * @file listWarns command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const warns = require('./warn').warns;

exports.run = (Bastion, message) => {
  if (!message.member.hasPermission('KICK_MEMBERS')) return Bastion.log.info('User doesn\'t have permission to use this command.');

  if (!warns[message.guild.id]) {
    return message.channel.send({
      color: Bastion.colors.green,
      description: 'No one has been warned yet.'
    }).catch(e => {
      Bastion.log.error(e.stack);
    });
  }

  let warnedUsers = [];
  Object.keys(warns[message.guild.id]).forEach(id => {
    warnedUsers.push(message.guild.members.get(id).user.tag);
  });

  message.channel.send({
    embed: {
      color: Bastion.colors.orange,
      title: 'Warning List',
      description: warnedUsers.join('\n')
    }
  }).catch(e => {
    Bastion.log.error(e.stack);
  });
};

exports.config = {
  aliases: [ 'warns' ],
  enabled: true
};

exports.help = {
  name: 'listwarns',
  description: 'Lists the server members who have been warned.',
  botPermission: '',
  userPermission: 'Kick Members',
  usage: 'listWarns',
  example: []
};
