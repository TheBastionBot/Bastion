/**
 * @file filterWord command
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
  if (!message.guild.me.hasPermission(this.help.botPermission)) {
    /**
     * Bastion has missing permissions.
     * @fires bastionMissingPermissions
     */
    return Bastion.emit('bastionMissingPermissions', this.help.botPermission, message);
  }

  Bastion.db.get(`SELECT filterWord FROM guildSettings WHERE guildID=${message.guild.id}`).then(row => {
    let color, filterWordStats;
    if (row.filterWord === 'false') {
      Bastion.db.run(`UPDATE guildSettings SET filterWord='true' WHERE guildID=${message.guild.id}`).catch(e => {
        Bastion.log.error(e);
      });
      color = Bastion.colors.green;
      filterWordStats = 'Enabled word filter in this server.';
    }
    else {
      Bastion.db.run(`UPDATE guildSettings SET filterWord='false' WHERE guildID=${message.guild.id}`).catch(e => {
        Bastion.log.error(e);
      });
      color = Bastion.colors.red;
      filterWordStats = 'Disabled word filter in this server.';
    }

    message.channel.send({
      embed: {
        color: color,
        description: filterWordStats
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
  name: 'filterword',
  description: string('filterWord', 'commandDescription'),
  botPermission: 'MANAGE_MESSAGES',
  userPermission: 'ADMINISTRATOR',
  usage: 'filterWord',
  example: []
};
