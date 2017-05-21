/*
 * Copyright (C) 2017 Sankarsan Kampa
 *                    https://sankarsankampa.com/contact
 *
 * This file is a part of Bastion Discord BOT.
 *                        https://github.com/snkrsnkampa/Bastion
 *
 * This code is licensed under the SNKRSN Shared License. It is free to
 * download, copy, compile, use, study and refer under the terms of the
 * SNKRSN Shared License. You can modify the code only for personal or
 * internal use only. However, you can not redistribute the code without
 * explicitly getting permission fot it.
 *
 * Bastion BOT is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY. See the SNKRSN Shared License for
 * more details.
 *
 * You should have received a copy of the SNKRSN Shared License along
 * with this program. If not, see <https://github.com/snkrsnkampa/Bastion/LICENSE>.
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
