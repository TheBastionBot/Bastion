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
  if (!message.member.hasPermission('BAN_MEMBERS')) return Bastion.log.info('You don\'t have permissions to use this command.');
  if (!message.guild.me.hasPermission('BAN_MEMBERS')) {
    return message.channel.send({embed: {
      color: Bastion.colors.red,
      description: `I need **${this.help.botPermission}** permission to use this command.`
    }}).catch(e => {
      Bastion.log.error(e.stack);
    });
  }

  if (!message.guild.available) return Bastion.log.info(`${message.guild.name} Guild is not available. It generally indicates a server outage.`);
  if (!(user = message.mentions.users.first())) {
    return message.channel.send({embed: {
      color: Bastion.colors.yellow,
      title: 'Usage',
      description: `\`${Bastion.config.prefix}${this.help.usage}\``
    }}).catch(e => {
      Bastion.log.error(e.stack);
    });
  }
  if (!message.guild.members.get(user.id).bannable) {
    return message.channel.send({embed: {
      color: Bastion.colors.red,
      description: `I don't have permissions to softban ${user}.`
    }}).catch(e => {
      Bastion.log.error(e.stack);
    });
  }

  message.guild.members.get(user.id).ban(7).catch(e => {
    Bastion.log.error(e.stack);
  });
  message.guild.unban(user.id).then(user => {
    let reason = args.slice(1).join(' ');
    if (reason.length < 1) {
      reason = 'No reason given';
    }

    message.channel.send({embed: {
      color: Bastion.colors.orange,
      title: 'Soft-Banned',
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
        },
        {
          name: 'Reason',
          value: reason,
          inline: false
        }
      ]
    }}).catch(e => {
      Bastion.log.error(e.stack);
    });

    sql.get(`SELECT modLog, modLogChannelID, modCaseNo FROM guildSettings WHERE guildID=${message.guild.id}`).then(row => {
      if (!row) return;

      if (row.modLog === 'true') {
        message.guild.channels.get(row.modLogChannelID).send({embed: {
          color: Bastion.colors.orange,
          title: 'Soft-banned user',
          fields: [
            {
              name: 'User',
              value: `${user}`,
              inline: true
            },
            {
              name: 'User ID',
              value: user.id,
              inline: true
            },
            {
              name: 'Reason',
              value: reason
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

    user.send({embed: {
      color: Bastion.colors.orange,
      title: `Soft-Banned from ${message.guild.name} Server`,
      description: `**Reason:** ${reason}`
    }}).catch(e => {
      Bastion.log.error(e.stack);
    });
  }).catch(e => {
    Bastion.log.error(e.stack);
    message.channel.send({embed: {
      color: Bastion.colors.red,
      title: 'Soft-Ban Error',
      description: 'Banned but unable to unban. Please unban the following user.',
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
  });
};

exports.config = {
  aliases: ['sb']
};

exports.help = {
  name: 'softban',
  description: 'Bans & unbans a mentioned user, and removes 7 days of their message history.',
  botPermission: 'Ban Members',
  permission: 'Ban Members',
  usage: 'softBan @user-mention [Reason]',
  example: ['softBan @user#0001 Reason for soft ban.']
};
