/**
 * @file filterWord command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.exec = async (Bastion, message) => {
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
  userTextPermission: 'ADMINISTRATOR',
  userVoicePermission: '',
  usage: 'filterWord',
  example: []
};
