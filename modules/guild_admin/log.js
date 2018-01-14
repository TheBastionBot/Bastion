/**
 * @file log command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.exec = async (Bastion, message) => {
  try {
    let guildSettings = await Bastion.db.get(`SELECT log FROM guildSettings WHERE guildID=${message.guild.id}`);

    let color, logStats;
    if (guildSettings.log) {
      await Bastion.db.run(`UPDATE guildSettings SET log=null WHERE guildID=${message.guild.id}`);
      color = Bastion.colors.RED;
      logStats = 'Logging is now disabled.';
    }
    else {
      await Bastion.db.run(`UPDATE guildSettings SET log=${message.channel.id} WHERE guildID=${message.guild.id}`);
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
  name: 'log',
  botPermission: '',
  userTextPermission: 'ADMINISTRATOR',
  userVoicePermission: '',
  usage: 'log',
  example: []
};
