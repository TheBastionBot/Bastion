/**
 * @file filterInvite command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.exec = async (Bastion, message) => {
  try {
    let guildSettings = await Bastion.db.get(`SELECT filterInvite FROM guildSettings WHERE guildID=${message.guild.id}`);

    let color, filterInviteStats;
    if (guildSettings.filterInvite) {
      await Bastion.db.run(`UPDATE guildSettings SET filterInvite=0 WHERE guildID=${message.guild.id}`);
      color = Bastion.colors.RED;
      filterInviteStats = 'Disabled automatic deletion of discord server invites posted in this server.';
    }
    else {
      await Bastion.db.run(`UPDATE guildSettings SET filterInvite=1 WHERE guildID=${message.guild.id}`);
      color = Bastion.colors.GREEN;
      filterInviteStats = 'Enabled automatic deletion of discord server invites posted in this server.';
    }

    message.channel.send({
      embed: {
        color: color,
        description: filterInviteStats
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
  aliases: [ 'filterinv' ],
  enabled: true
};

exports.help = {
  name: 'filterInvite',
  botPermission: 'MANAGE_MESSAGES',
  userTextPermission: 'ADMINISTRATOR',
  userVoicePermission: '',
  usage: 'filterInvite',
  example: []
};
