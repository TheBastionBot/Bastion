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
      logStats = Bastion.strings.info(message.guild.language, 'disableServerLog', message.author.tag);
    }
    else {
      await Bastion.db.run(`UPDATE guildSettings SET log=${message.channel.id} WHERE guildID=${message.guild.id}`);
      color = Bastion.colors.GREEN;
      logStats = Bastion.strings.info(message.guild.language, 'enableServerLog', message.author.tag);
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
  userTextPermission: 'MANAGE_GUILD',
  userVoicePermission: '',
  usage: 'log',
  example: []
};
