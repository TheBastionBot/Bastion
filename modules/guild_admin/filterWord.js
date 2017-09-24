/**
 * @file filterWord command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

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

  try {
    let guildSettings = await Bastion.db.get(`SELECT filterWord FROM guildSettings WHERE guildID=${message.guild.id}`);

    let color, filterWordStats;
    if (guildSettings.filterWord) {
      await Bastion.db.run(`UPDATE guildSettings SET filterWord=0 WHERE guildID=${message.guild.id}`);
      color = Bastion.colors.RED;
      filterWordStats = 'Disabled word filter in this server.';
    }
    else {
      await Bastion.db.run(`UPDATE guildSettings SET filterWord=1 WHERE guildID=${message.guild.id}`);
      color = Bastion.colors.GREEN;
      filterWordStats = 'Enabled word filter in this server.';
    }

    message.channel.send({
      embed: {
        color: color,
        description: filterWordStats
      }
    }).catch(e => {
      Bastion.log.error(e);
    });
  }
  catch (e) {
    Bastion.log.error(e);
  }
};

exports.config = {
  aliases: [],
  enabled: true
};

exports.help = {
  name: 'filterWord',
  botPermission: 'MANAGE_MESSAGES',
  userPermission: 'ADMINISTRATOR',
  usage: 'filterWord',
  example: []
};
