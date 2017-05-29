/**
 * @file warn command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const sql = require('sqlite');
sql.open('./data/Bastion.sqlite');
let guilds = {};
exports.warns = guilds;

exports.run = (Bastion, message, args) => {
  if (!message.member.hasPermission('KICK_MEMBERS')) return Bastion.log.info('User doesn\'t have permission to use this command.');
  if (!message.guild.me.hasPermission('KICK_MEMBERS')) {
    return message.channel.send({
      embed: {
        color: Bastion.colors.red,
        description: `I need **${this.help.botPermission}** permission to use this command.`
      }
    }).catch(e => {
      Bastion.log.error(e.stack);
    });
  }

  if (!message.guild.available) return Bastion.log.info(`${message.guild.name} Guild is not available. It generally indicates a server outage.`);
  let user = message.mentions.users.first();
  if (!user) {
    return message.channel.send({
      embed: {
        color: Bastion.colors.yellow,
        title: 'Usage',
        description: `\`${Bastion.config.prefix}${this.help.usage}\``
      }
    }).catch(e => {
      Bastion.log.error(e.stack);
    });
  }

  if (message.author.id !== message.guild.ownerID && message.member.highestRole.comparePositionTo(message.guild.members.get(user.id).highestRole) <= 0) return Bastion.log.info('User doesn\'t have permission to use this command on that role.');
  if (!message.guild.members.get(user.id).kickable) {
    return message.channel.send({
      embed: {
        color: Bastion.colors.red,
        description: `I don't have permissions to warn ${user}.`
      }
    }).catch(e => {
      Bastion.log.error(e.stack);
    });
  }

  let reason = args.slice(1).join(' ');
  if (reason.length < 1) {
    reason = 'No reason given';
  }

  if (!guilds.hasOwnProperty(message.guild.id)) {
    guilds[message.guild.id] = {};
  }
  if (!guilds[message.guild.id].hasOwnProperty(user.id)) {
    guilds[message.guild.id][user.id] = 1;
  }
  else {
    if (guilds[message.guild.id][user.id] === 2) {
      message.guild.members.get(user.id).kick().then(member => {
        delete guilds[message.guild.id][user.id];
        message.channel.send({
          embed: {
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
                value: 'Warned 3 times!',
                inline: false
              }
            ]
          }
        }).catch(e => {
          Bastion.log.error(e.stack);
        });

        sql.get(`SELECT modLog, modLogChannelID, modCaseNo FROM guildSettings WHERE guildID=${message.guild.id}`).then(row => {
          if (!row) return;

          if (row.modLog === 'true') {
            message.guild.channels.get(row.modLogChannelID).send({
              embed: {
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
                    value: 'Warned 3 times!'
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
              }
            }).then(() => {
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

        member.send({
          embed: {
            color: Bastion.colors.orange,
            title: `Kicked from ${message.guild.name} Server`,
            fields: [
              {
                name: 'Reason',
                value: 'You have been warned 3 times!'
              }
            ]
          }
        }).catch(e => {
          Bastion.log.error(e.stack);
        });
      }).catch(e => {
        Bastion.log.error(e.stack);
      });
    }
    else {
      guilds[message.guild.id][user.id] += 1;
    }
  }
  message.channel.send({
    embed: {
      color: Bastion.colors.orange,
      title: 'Warning',
      description: `${user} have been warned by ${message.author} for **${reason}**.`
    }
  }).then(() => {
    user.send({
      embed: {
        color: Bastion.colors.orange,
        title: 'Warning',
        description: 'You have been warned!',
        fields: [
          {
            name: 'Reason',
            value: reason
          },
          {
            name: 'Server',
            value: message.guild.name
          }
        ]
      }
    }).catch(e => {
      Bastion.log.error(e);
    });
  }).catch(e => {
    Bastion.log.error(e);
  });

  sql.get(`SELECT modLog, modLogChannelID, modCaseNo FROM guildSettings WHERE guildID=${message.guild.id}`).then(row => {
    if (!row) return;

    if (row.modLog === 'true') {
      message.guild.channels.get(row.modLogChannelID).send({
        embed: {
          color: Bastion.colors.orange,
          title: 'Warned user',
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
        }
      }).then(() => {
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
};

exports.config = {
  aliases: [ 'w' ],
  enabled: true
};

exports.help = {
  name: 'warn',
  description: 'Warns a mentioned user with an optional reason. After 3 warnings are given, the users automatically gets kicked from the server.',
  botPermission: 'Kick Members',
  userPermission: 'Kick Members',
  usage: 'warn @user-mention [Reason]',
  example: [ 'warn @user#0001 Reason for the warning.' ]
};
