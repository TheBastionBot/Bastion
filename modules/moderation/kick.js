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
  if (!message.member.hasPermission('KICK_MEMBERS')) return Bastion.log.info('User doesn\'t have permission to use this command.');
  if (!message.guild.me.hasPermission('KICK_MEMBERS')) {
    return message.channel.send({embed: {
      color: Bastion.colors.red,
      description: `I need **${this.help.botPermission}** permission to use this command.`
    }}).catch(e => {
      Bastion.log.error(e.stack);
    });
  }

  if (!message.guild.available) return Bastion.log.info(`${message.guild.name} Guild is not available. It generally indicates a server outage.`);
  let user = message.mentions.users.first();
  if (!user) {
    return message.channel.send({embed: {
      color: Bastion.colors.yellow,
      title: 'Usage',
      description: `\`${Bastion.config.prefix}${this.help.usage}\``
    }}).catch(e => {
      Bastion.log.error(e.stack);
    });
  }
  if (!message.guild.members.get(user.id).kickable) {
    return message.channel.send({embed: {
      color: Bastion.colors.red,
      description: `I don't have permissions to kick ${user}.`
    }}).catch(e => {
      Bastion.log.error(e.stack);
    });
  }

  message.guild.members.get(user.id).kick().then(member => {
    let reason = args.slice(1).join(' ');
    if (reason.length < 1) {
      reason = 'No reason given';
    }

    message.channel.send({embed: {
      color: Bastion.colors.orange,
      title: 'Kicked',
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
          title: 'Kicked user',
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
        }}).then(() => {
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

    member.send({embed: {
      color: Bastion.colors.orange,
      title: `Kicked from ${message.guild.name} Server`,
      description: `**Reason:** ${reason}`
    }}).catch(e => {
      Bastion.log.error(e.stack);
    });
  }).catch(e => {
    Bastion.log.error(e.stack);
  });
};

exports.config = {
  aliases: ['k'],
  enabled: true
};

exports.help = {
  name: 'kick',
  description: 'Kicks a mentioned user with an optional reason.',
  botPermission: 'Kick Members',
  userPermission: 'Kick Members',
  usage: 'kick @user-mention [Reason]',
  example: ['kick @user#0001 Reason for the kick.']
};
