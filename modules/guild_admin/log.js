/**
 * @file log command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const sql = require('sqlite');
sql.open('./data/Bastion.sqlite');

exports.run = (Bastion, message) => {
  if (!message.member.hasPermission(this.help.userPermission)) {
    /**
     * User has missing permissions.
     * @fires userMissingPermissions
     */
    return Bastion.emit('userMissingPermissions', this.help.userPermission);
  }

  sql.get(`SELECT log, logChannelID FROM guildSettings WHERE guildID=${message.guild.id}`).then(row => {
    let color, logStats;
    if (row.log === 'false') {
      sql.run(`UPDATE guildSettings SET log='true', logChannelID=${message.channel.id} WHERE guildID=${message.guild.id}`).catch(e => {
        Bastion.log.error(e.stack);
      });
      color = Bastion.colors.green;
      logStats = 'Logging is now enabled in this channel.';
    }
    else {
      sql.run(`UPDATE guildSettings SET log='false', logChannelID=null WHERE guildID=${message.guild.id}`).catch(e => {
        Bastion.log.error(e.stack);
      });
      color = Bastion.colors.red;
      logStats = 'Logging is now disabled.';
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
  aliases: [],
  enabled: true
};

exports.help = {
  name: 'log',
  description: 'Toggle logging of various events in the server.',
  botPermission: '',
  userPermission: 'ADMINISTRATOR',
  usage: 'log',
  example: []
};
