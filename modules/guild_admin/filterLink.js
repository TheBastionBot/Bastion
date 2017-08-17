/**
 * @file filterLink command
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
  if (!message.guild.me.hasPermission(this.help.botPermission)) {
    /**
     * Bastion has missing permissions.
     * @fires bastionMissingPermissions
     */
    return Bastion.emit('bastionMissingPermissions', this.help.botPermission, message);
  }

  let guildSettings = await Bastion.db.get(`SELECT filterLink FROM guildSettings WHERE guildID=${message.guild.id}`).catch(e => {
    Bastion.log.error(e);
  });

  let color, filterLinkStats;
  if (guildSettings.filterLink === 'false') {
    await Bastion.db.run(`UPDATE guildSettings SET filterLink='true' WHERE guildID=${message.guild.id}`).catch(e => {
      Bastion.log.error(e);
    });
    color = Bastion.colors.GREEN;
    filterLinkStats = 'Enabled automatic deletion of links posted in this server.';
  }
  else {
    await Bastion.db.run(`UPDATE guildSettings SET filterLink='false' WHERE guildID=${message.guild.id}`).catch(e => {
      Bastion.log.error(e);
    });
    color = Bastion.colors.RED;
    filterLinkStats = 'Disabled automatic deletion of links posted in this server.';
  }

  message.channel.send({
    embed: {
      color: color,
      description: filterLinkStats
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
  name: 'filterlink',
  description: string('filterLink', 'commandDescription'),
  botPermission: 'MANAGE_MESSAGES',
  userPermission: 'ADMINISTRATOR',
  usage: 'filterLink',
  example: []
};
