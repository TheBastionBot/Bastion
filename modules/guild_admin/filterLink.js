/**
 * @file filterLink command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.exec = async (Bastion, message) => {
  try {
    let guildSettings = await Bastion.db.get(`SELECT filterLink FROM guildSettings WHERE guildID=${message.guild.id}`);

    let color, filterLinkStats;
    if (guildSettings.filterLink) {
      await Bastion.db.run(`UPDATE guildSettings SET filterLink=0 WHERE guildID=${message.guild.id}`);
      color = Bastion.colors.RED;
      filterLinkStats = 'Disabled automatic deletion of links posted in this server.';
    }
    else {
      await Bastion.db.run(`UPDATE guildSettings SET filterLink=1 WHERE guildID=${message.guild.id}`);
      color = Bastion.colors.GREEN;
      filterLinkStats = 'Enabled automatic deletion of links posted in this server.';
    }

    message.channel.send({
      embed: {
        color: color,
        description: filterLinkStats
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
  name: 'filterLink',
  botPermission: 'MANAGE_MESSAGES',
  userTextPermission: 'ADMINISTRATOR',
  userVoicePermission: '',
  usage: 'filterLink',
  example: []
};
