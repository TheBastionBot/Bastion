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
sql.open('./data/Bastion.sqlite');

exports.run = (Bastion, message, args) => {
  if (!message.member.hasPermission('ADMINISTRATOR')) return Bastion.log.info('User doesn\'t have permission to use this command.');
    if (!Bastion.credentials.cleverbotAPIkey) {
      return message.channel.send({embed: {
        color: Bastion.colors.red,
        description: 'Cleverbot API key has not been set. I can\'t chat with you! :sob:'
      }}).catch(e => {
        Bastion.log.error(e.stack);
      });
    }

  sql.get(`SELECT chat FROM guildSettings WHERE guildID=${message.guild.id}`).then(row => {
    let color, chatStats;
    if (row.chat === 'false') {
      sql.run(`UPDATE guildSettings SET chat='true' WHERE guildID=${message.guild.id}`).catch(e => {
        Bastion.log.error(e.stack);
      });
      color = Bastion.colors.green;
      chatStats = 'Enabled chat in this server. Now I\'ll respond if anyone mentions me, Ain\'t that cool? :sunglasses:';
    }
    else {
      sql.run(`UPDATE guildSettings SET chat='false' WHERE guildID=${message.guild.id}`).catch(e => {
        Bastion.log.error(e.stack);
      });
      color = Bastion.colors.red;
      chatStats = 'Disabled chat in this server. Now I\'m gonna miss talking with you. :disappointed:';
    }

    message.channel.send({embed: {
      color: color,
      description: chatStats
    }}).catch(e => {
      Bastion.log.error(e.stack);
    });
  }).catch(e => {
    Bastion.log.error(e.stack);
  });
};

exports.config = {
  aliases: [],
  enabled: true
};

exports.help = {
  name: 'chat',
  description: 'Toggles chatting feature of the bot.',
  botPermission: '',
  userPermission: 'Administrator',
  usage: 'chat',
  example: []
};
