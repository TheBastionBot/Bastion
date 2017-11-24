/**
 * @file slowMode command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.run = async (Bastion, message) => {
  if (!message.member.hasPermission(this.help.userTextPermission)) {
    /**
     * User has missing permissions.
     * @fires userMissingPermissions
     */
    return Bastion.emit('userMissingPermissions', this.help.userTextPermission);
  }

  try {
    let guildSettings = await Bastion.db.get(`SELECT slowMode FROM guildSettings WHERE guildID=${message.guild.id}`);

    let color, slowModeStats;
    if (guildSettings.slowMode) {
      await Bastion.db.run(`UPDATE guildSettings SET slowMode=0 WHERE guildID=${message.guild.id}`);
      color = Bastion.colors.RED;
      slowModeStats = 'Slow mode is now disabled. Everyone, get spicy!';
    }
    else {
      await Bastion.db.run(`UPDATE guildSettings SET slowMode=1 WHERE guildID=${message.guild.id}`);
      color = Bastion.colors.GREEN;
      slowModeStats = 'Slow mode is now enabled. Beware spammers!';
    }

    message.channel.send({
      embed: {
        color: color,
        description: slowModeStats
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
  name: 'slowMode',
  botPermission: '',
  userTextPermission: 'ADMINISTRATOR',
  userVoicePermission: '',
  usage: 'slowMode',
  example: []
};
