/**
 * @file modLog command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

// This feature is absolutely useless because Discord already has audit logs. I'll probably remove this in future.

const string = require('../../handlers/languageHandler');

exports.run = async (Bastion, message) => {
  if (!message.member.hasPermission(this.help.userPermission)) {
    /**
     * User has missing permissions.
     * @fires userMissingPermissions
     */
    return Bastion.emit('userMissingPermissions', this.help.userPermission);
  }

  let guildSettings = await Bastion.db.get(`SELECT modLog FROM guildSettings WHERE guildID=${message.guild.id}`).catch(e => {
    Bastion.log.error(e);
  });

  let color, modLogStats;
  if (guildSettings.modLog) {
    await Bastion.db.run(`UPDATE guildSettings SET modLog=null WHERE guildID=${message.guild.id}`).catch(e => {
      Bastion.log.error(e);
    });
    color = Bastion.colors.red;
    modLogStats = 'Moderation audit logging is now disabled.';
  }
  else {
    await Bastion.db.run(`UPDATE guildSettings SET modLog=${message.channel.id} WHERE guildID=${message.guild.id}`).catch(e => {
      Bastion.log.error(e);
    });
    color = Bastion.colors.green;
    modLogStats = 'Moderation audit logging is now enabled in this channel.';
  }

  message.channel.send({
    embed: {
      color: color,
      description: modLogStats
    }
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
