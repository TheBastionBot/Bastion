/**
 * @file log command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const string = require('../../handlers/languageHandler');

exports.run = (Bastion, message) => {
  if (!message.member.hasPermission(this.help.userPermission)) {
    /**
     * User has missing permissions.
     * @fires userMissingPermissions
     */
    return Bastion.emit('userMissingPermissions', this.help.userPermission);
  }

  Bastion.db.get(`SELECT log, logChannelID FROM guildSettings WHERE guildID=${message.guild.id}`).then(row => {
    let color, logStats;
    if (row.log === 'false') {
      Bastion.db.run(`UPDATE guildSettings SET log='true', logChannelID=${message.channel.id} WHERE guildID=${message.guild.id}`).catch(e => {
        Bastion.log.error(e);
      });
      color = Bastion.colors.green;
      logStats = 'Logging is now enabled in this channel.';
    }
    else {
      Bastion.db.run(`UPDATE guildSettings SET log='false', logChannelID=null WHERE guildID=${message.guild.id}`).catch(e => {
        Bastion.log.error(e);
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
      Bastion.log.error(e);
    });
  }).catch(e => {
    Bastion.log.error(e);
  });
};

exports.config = {
  aliases: [],
  enabled: true
};

exports.help = {
  name: 'log',
  description: string('log', 'commandDescription'),
  botPermission: '',
  userPermission: 'ADMINISTRATOR',
  usage: 'log',
  example: []
};
