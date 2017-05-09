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
  if (!message.channel.permissionsFor(message.member).has('MANAGE_MESSAGES')) return Bastion.log.info('User doesn\'t have permission to use this command.');
  if (!message.channel.permissionsFor(message.guild.me).has('MANAGE_MESSAGES')) {
    return message.channel.send({embed: {
      color: Bastion.colors.red,
      description: `I need **${this.help.botPermission}** permission, in this channel, to use this command.`
    }}).catch(e => {
      Bastion.log.error(e.stack);
    });
  }

  user = message.mentions.users.first();
  limit = parseInt(args[0]) ? args[0] : args[1];
  if (user || args.includes('--bots')) {
    amount = 100;
  }
  else {
    amount = /^[1-9][0-9]?$|^100$/.test(limit) ? parseInt(limit) : 100;
  }

  message.channel.fetchMessages({
    limit: amount
  }).then(msgs => {
    msgs = msgs.filter(m => message.createdTimestamp - m.createdTimestamp < 1209600000);
    if (user) {
      msgs = msgs.filter(m => m.author.id === user.id).array().slice(0, /^[1-9][0-9]?$|^100$/.test(limit) ? parseInt(limit) : 100);
    }
    else if (args.includes('--bots')) {
      msgs = msgs.filter(m => m.author.bot).array().slice(0, /^[1-9][0-9]?$|^100$/.test(limit) ? parseInt(limit) : 100);
    }
    if (msgs.size < 2 || msgs.length < 2) {
      if ((msgs.size === 1 || msgs.length === 1) && (user || args.includes('--bots'))) {
        error = 'Dude, you can delete a single message by yourself, right? You don\'t need me for that!';
      }
      else {
        error = 'No messages found that could be deleted.';
      }
      return message.channel.send({embed: {
        color: Bastion.colors.red,
        description: error
      }}).catch(e => {
        Bastion.log.error(e.stack);
      });
    }
    message.channel.bulkDelete(msgs).then(() => {
      sql.get(`SELECT modLog, modLogChannelID, modCaseNo FROM guildSettings WHERE guildID=${message.guild.id}`).then(row => {
        if (!row) return;

        if (row.modLog === 'true') {
          message.guild.channels.get(row.modLogChannelID).send({embed: {
            color: Bastion.colors.orange,
            title: 'Messages Cleared',
            fields: [
              {
                name: 'Channel',
                value: `${message.channel}`,
                inline: true
              },
              {
                name: 'Channel ID',
                value: message.channel.id,
                inline: true
              },
              {
                name: 'Cleared',
                value: `${msgs.size || msgs.length} messages from ${user ? user : args.includes('--bots') ? 'BOTs' : 'everyone'}`
              },
              {
                name: 'Responsible Moderator',
                value: `${message.author}`,
                inline: true
              },
              {
                name: 'Moderator ID',
                value: message.author.id,
                inline: true
              }
            ],
            footer: {
              text: `Case Number: ${row.modCaseNo}`
            },
            timestamp: new Date()
          }}).then(msg => {
            sql.run(`UPDATE guildSettings SET modCaseNo=${parseInt(row.modCaseNo) + 1} WHERE guildID=${message.guild.id}`).catch(e => {
              Bastion.log.error(e.stack);
            });
          }).catch(e => {
            Bastion.log.error(e.stack);
          });
        }
      }).catch(e => {
        Bastion.log.error(e.stack);
      });
    }).catch(e => {
      Bastion.log.error(e.stack);
    });
  }).catch(e => {
    Bastion.log.error(e.stack);
  });
};

exports.config = {
  aliases: ['clr'],
  enabled: true
};

exports.help = {
  name: 'clear',
  description: 'Delete a bulk of messages from a channel specified by an user and/or number. If no user is specified, delete everyone\'s messages. If no amount is specified, it defaults to 100 messages. It also accepts a parameter `--bots`, which clears messages from bots in that channel.',
  botPermission: 'Manage Messages',
  userPermission: 'Manage Messages',
  usage: 'clear [@user-mention | --bots] [no_of_messages]',
  example: ['clear 50', 'clear @user#0001 5', 'clear --bots 10', 'clear']
};
