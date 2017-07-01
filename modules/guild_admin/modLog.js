/**
 * @file modLog command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

// This feature is absolutely useless because Discord already has audit logs. I'll probably remove this in future.

const string = require('../../handlers/languageHandler');

exports.run = (Bastion, message) => {
  if (!message.member.hasPermission(this.help.userPermission)) {
    /**
     * User has missing permissions.
     * @fires userMissingPermissions
     */
    return Bastion.emit('userMissingPermissions', this.help.userPermission);
  }

  Bastion.db.get(`SELECT modLog, modLogChannelID FROM guildSettings WHERE guildID=${message.guild.id}`).then(row => {
    let color, modLogStats;
    if (row.modLog === 'false') {
      Bastion.db.run(`UPDATE guildSettings SET modLog='true', modLogChannelID=${message.channel.id} WHERE guildID=${message.guild.id}`).catch(e => {
        Bastion.log.error(e);
      });
      color = Bastion.colors.green;
      modLogStats = 'Moderation audit logging is now enabled in this channel.';
    }
    else {
      Bastion.db.run(`UPDATE guildSettings SET modLog='false', modLogChannelID=null WHERE guildID=${message.guild.id}`).catch(e => {
        Bastion.log.error(e);
      });
      color = Bastion.colors.red;
      modLogStats = 'Moderation audit logging is now disabled.';
    }
    message.channel.send({
      embed: {
        color: color,
        description: modLogStats
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
  name: 'modlog',
  description: string('modLog', 'commandDescription'),
  botPermission: '',
  userPermission: 'ADMINISTRATOR',
  usage: 'modLog',
  example: []
};
