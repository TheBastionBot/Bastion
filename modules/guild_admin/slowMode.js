/**
 * @file slowMode command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.exec = async (Bastion, message) => {
  try {
    let guildSettings = await Bastion.db.get(`SELECT slowMode FROM guildSettings WHERE guildID=${message.guild.id}`);

    let color, slowModeStats;
    if (guildSettings.slowMode) {
      await Bastion.db.run(`UPDATE guildSettings SET slowMode=0 WHERE guildID=${message.guild.id}`);
      color = Bastion.colors.RED;
      slowModeStats = Bastion.strings.info(message.guild.language, 'disableSlowMode', message.author.tag);
    }
    else {
      await Bastion.db.run(`UPDATE guildSettings SET slowMode=1 WHERE guildID=${message.guild.id}`);
      color = Bastion.colors.GREEN;
      slowModeStats = Bastion.strings.info(message.guild.language, 'enableSlowMode', message.author.tag);
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
  userTextPermission: 'MANAGE_GUILD',
  userVoicePermission: '',
  usage: 'slowMode',
  example: []
};
