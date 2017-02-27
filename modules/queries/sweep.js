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

exports.run = function(Bastion, message, args) {
  let members = message.guild.members.map(m => m.user.id);
  let sweepedUserId = members[Math.floor(Math.random()*members.length)];
  let sweepedUser = message.guild.members.get(sweepedUserId).user;

  message.channel.sendMessage('', {embed: {
    color: 6651610,
    title: 'Sweeped user',
    fields: [
      {
        name: 'User',
        value: `**${sweepedUser.username}**#${sweepedUser.discriminator}`,
        inline: true
      },
      {
        name: 'ID',
        value: sweepedUserId,
        inline: true
      }
    ]
  }});
};

exports.conf = {
  aliases: []
};

exports.help = {
  name: 'sweep',
  description: 'Shows a random user from the server.',
  permission: '',
  usage: ['sweep']
};
