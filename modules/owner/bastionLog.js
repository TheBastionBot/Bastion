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

exports.run = (Bastion, message) => {
  if (!Bastion.credentials.ownerId.includes(message.author.id)) return Bastion.log.info('User doesn\'t have permission to use this command.');

  sql.get('SELECT log, logChannelID FROM bastionSettings').then(row => {
    let color = Bastion.colors.green;
    let logStats = 'Bastion\'s logging is now enabled in this channel.';
    if (!row) {
      sql.run('INSERT INTO bastionSettings (log, logChannelID) VALUES (?, ?)', ['true', message.channel.id]).catch(e => {
        Bastion.log.error(e.stack);
      });
    }
    else if (row.log === 'false') {
      sql.run(`UPDATE bastionSettings SET log='true', logChannelID=${message.channel.id}`).catch(e => {
        Bastion.log.error(e.stack);
      });
    }
    else {
      sql.run('UPDATE bastionSettings SET log=\'false\', logChannelID=null').catch(e => {
        Bastion.log.error(e.stack);
      });
      color = Bastion.colors.red;
      logStats = 'Bastion\'s logging is now disabled.';
    }
    message.channel.send({
      embed: {
        color: color,
        description: logStats
      }
    }).catch(e => {
      Bastion.log.error(e.stack);
    });
  }).catch(e => {
    Bastion.log.error(e.stack);
  });
};

exports.config = {
  aliases: ['botlog'],
  enabled: true
};

exports.help = {
  name: 'bastionlog',
  description: 'Toggle logging of various events of the bot.',
  botPermission: '',
  userPermission: 'Bot Owner',
  usage: 'bastionLog',
  example: []
};
