/**
 * @file removeAllRoles command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const sql = require('sqlite');
sql.open('./data/Bastion.sqlite');

exports.run = (Bastion, message, args) => {
  if (!message.member.hasPermission(this.help.userPermission)) {
    /**
     * User has missing permissions.
     * @fires userMissingPermissions
     */
    return Bastion.emit('userMissingPermissions', this.help.userPermission);
  }
  if (!message.guild.me.hasPermission(this.help.botPermission)) {
    /**
     * Bastion has missing permissions.
     * @fires bastionMissingPermissions
     */
    return Bastion.emit('bastionMissingPermissions', this.help.botPermission, message);
  }

  if (args.length < 1) {
    /**
     * The command was ran with invalid parameters.
     * @fires commandUsage
     */
    return Bastion.emit('commandUsage', message, this.help);
  }

  let user = message.mentions.users.first();
  if (!user) {
    user = message.author;
  }
  if (message.author.id !== message.guild.ownerID && user.id !== message.guild.ownerID && message.member.highestRole.comparePositionTo(message.guild.members.get(user.id).highestRole) <= 0) return Bastion.log.info('User doesn\'t have permission to use this command on that role.');

  message.guild.members.get(user.id).removeRoles(message.guild.members.get(user.id).roles).then(() => {
    message.channel.send({
      embed: {
        color: Bastion.colors.red,
        title: 'All Roles Removed',
        description: `All roles has been removed from ${user.tag}.`
      }
    }).catch(e => {
      Bastion.log.error(e.stack);
    });

    sql.get(`SELECT modLog, modLogChannelID, modCaseNo FROM guildSettings WHERE guildID=${message.guild.id}`).then(row => {
      if (!row) return;

      if (row.modLog === 'true') {
        message.guild.channels.get(row.modLogChannelID).send({
          embed: {
            color: Bastion.colors.red,
            title: 'Removed all roles',
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
  }).catch(e => {
    Bastion.log.error(e.stack);
    message.channel.send({
      embed: {
        color: Bastion.colors.red,
        description: 'I don\'t have enough permission to do that operation.'
      }
    }).catch(e => {
      Bastion.log.error(e.stack);
    });
  });
};

exports.config = {
  aliases: [ 'rmar' ],
  enabled: true
};

exports.help = {
  name: 'removeallroles',
  description: 'Removes all roles from a mentioned user. If no user is mentioned, removes all roles from you.',
  botPermission: 'MANAGE_ROLES',
  userPermission: 'MANAGE_ROLES',
  usage: 'removeAllRoles [@user-mention]',
  example: [ 'removeAllRoles @user#0001', 'removeAllRoles' ]
};
