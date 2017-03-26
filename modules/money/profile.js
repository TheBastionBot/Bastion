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

const sql = require('sqlite');
sql.open('../Bastion.sqlite');

exports.run = function(Bastion, message, args) {
  if (!(args = message.mentions.users.first())) args = message.author;
  sql.get(`SELECT p1.*, (SELECT COUNT(*) FROM profiles AS p2 WHERE p2.xp>p1.xp) AS rank FROM profiles as p1 WHERE p1.userID=${args.id}`).then(profile => {
    if (!profile) {
      if (args == message.author) return message.channel.sendMessage('', {embed: {
        color: 6651610,
        description: `Your profile is now created, <@${args.id}>`
      }});
      else return message.channel.sendMessage('', {embed: {
        color: 6651610,
        description: `<@${args.id}>'s profile is not yet created.`
      }});
    }
    message.channel.sendMessage('', {embed: {
      color: 6651610,
      title: 'User Profile',
      description: `**${args.username}**#${args.discriminator}`,
      fields: [
        {
          name: 'Bastion Currency',
          value: profile.bastionCurrencies,
          inline: true
        },
        {
          name: 'Rank',
          value: profile.rank+1,
          inline: true
        },
        {
          name: 'Experience Points',
          value: profile.xp,
          inline: true
        },
        {
          name: 'Level',
          value: profile.level,
          inline: true
        }
      ],
      thumbnail: {
        url: args.avatarURL
      }
    }}).catch(e => {
      Bastion.log.error(e.stack);
    });
  }).catch(e => {
    Bastion.log.error(e.stack);
  });
};

exports.config = {
  aliases: []
};

exports.help = {
  name: 'profile',
  description: 'Shows a mentioned user\'s Bastion profile. If no one is mentioned, shows your profile.',
  permission: '',
  usage: 'profile [@user-mention]',
  example: ['profle', 'profile @user#0001']
};
