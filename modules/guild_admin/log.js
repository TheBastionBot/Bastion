/**
 * @file log command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const string = require('../../handlers/languageHandler');

exports.run = async (Bastion, message) => {
  if (!message.member.hasPermission(this.help.userPermission)) {
    /**
     * User has missing permissions.
     * @fires userMissingPermissions
     */
    return Bastion.emit('userMissingPermissions', this.help.userPermission);
  }

  let guildSettings = await Bastion.db.get(`SELECT log FROM guildSettings WHERE guildID=${message.guild.id}`).catch(e => {
    Bastion.log.error(e);
  });

  let color, logStats;
  if (guildSettings.log) {
    await Bastion.db.run(`UPDATE guildSettings SET log=null WHERE guildID=${message.guild.id}`).catch(e => {
      Bastion.log.error(e);
    });
    color = Bastion.colors.RED;
    logStats = 'Logging is now disabled.';
  }
  else {
    await Bastion.db.run(`UPDATE guildSettings SET log=${message.channel.id} WHERE guildID=${message.guild.id}`).catch(e => {
      Bastion.log.error(e);
    });
    color = Bastion.colors.GREEN;
    logStats = 'Logging is now enabled in this channel.';
  }

  message.channel.send({
    embed: {
      color: color,
      description: logStats
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
  name: 'log',
  description: string('log', 'commandDescription'),
  botPermission: '',
  userPermission: 'ADMINISTRATOR',
  usage: 'log',
  example: []
};
