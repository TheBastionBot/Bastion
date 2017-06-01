/**
 * @file filterInvite command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const sql = require('sqlite');
sql.open('./data/Bastion.sqlite');

exports.run = (Bastion, message) => {
  if (!message.member.hasPermission(this.help.userPermission)) return Bastion.log.info('User doesn\'t have permission to use this command.');
  if (!message.guild.me.hasPermission(this.help.botPermission)) {
    return message.channel.send({
      embed: {
        color: Bastion.colors.red,
        description: `I need **${this.help.botPermission}** permission to use this command.`
      }
    }).catch(e => {
      Bastion.log.error(e.stack);
    });
  }

  sql.get(`SELECT filterInvite FROM guildSettings WHERE guildID=${message.guild.id}`).then(row => {
    let color, filterInviteStats;
    if (row.filterInvite === 'false') {
      sql.run(`UPDATE guildSettings SET filterInvite='true' WHERE guildID=${message.guild.id}`).catch(e => {
        Bastion.log.error(e.stack);
      });
      color = Bastion.colors.green;
      filterInviteStats = 'Enabled automatic deletion of discord server invites posted in this server.';
    }
    else {
      sql.run(`UPDATE guildSettings SET filterInvite='false' WHERE guildID=${message.guild.id}`).catch(e => {
        Bastion.log.error(e.stack);
      });
      color = Bastion.colors.red;
      filterInviteStats = 'Disabled automatic deletion of discord server invites posted in this server.';
    }

    message.channel.send({
      embed: {
        color: color,
        description: filterInviteStats
      }
    }).catch(e => {
      Bastion.log.error(e.stack);
    });
  }).catch(e => {
    Bastion.log.error(e.stack);
  });
};

exports.config = {
  aliases: [ 'filterinv' ],
  enabled: true
};

exports.help = {
  name: 'filterinvite',
  description: 'Toggles automatic deleting of discord server invites posted in the server. Does not apply to the server Administrators.',
  botPermission: 'MANAGE_MESSAGES',
  userPermission: 'ADMINISTRATOR',
  usage: 'filterInvite',
  example: []
};
