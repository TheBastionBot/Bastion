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

exports.run = (Bastion, message, args) => {
  let user = message.mentions.users.first();
  if (!user) {
    user = message.author;
  }

  message.channel.send({embed: {
    color: Bastion.colors.blue,
    fields: [
      {
        name: 'User',
        value: user.tag,
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

exports.config = {
  aliases: ['uid'],
  enabled: true
};

exports.help = {
  name: 'userid',
  description: 'Shows the mentioned user\'s ID. If no user is mentioned, shows your ID.',
  botPermission: '',
  userPermission: '',
  usage: 'userID [@user-mention]',
  example: ['userID @user#0001', 'userID']
};
