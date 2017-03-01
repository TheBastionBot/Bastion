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
  if (!(user = message.mentions.users.first())) user = message.author;

  message.channel.sendMessage('', {embed: {
    color: 6651610,
    fields: [
      {
        name: 'User',
        value: `**${user.username}**#${user.discriminator}`,
        inline: true
      },
      {
        name: 'ID',
        value: user.id,
        inline: true
      }
    ]
  }}).catch(e => {
    Bastion.log.error(e.stack);
  });
};

exports.conf = {
  aliases: ['uid']
};

exports.help = {
  name: 'userid',
  description: 'Shows the mentioned user\'s ID. If no user is mentioned, shows your ID.',
  permission: '',
  usage: ['userID @user#0001', 'userID']
};
