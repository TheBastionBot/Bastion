/**
 * @file modLog command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

// This feature is absolutely useless because Discord already has audit logs. I'll probably remove this in future.

exports.exec = async (Bastion, message) => {
  try {
    let guildSettings = await Bastion.db.get(`SELECT modLog FROM guildSettings WHERE guildID=${message.guild.id}`);

    let color, modLogStats;
    if (guildSettings.modLog) {
      await Bastion.db.run(`UPDATE guildSettings SET modLog=null WHERE guildID=${message.guild.id}`);
      color = Bastion.colors.RED;
      modLogStats = Bastion.strings.info(message.guild.language, 'disableModerationLog', message.author.tag);
    }
    else {
      await Bastion.db.run(`UPDATE guildSettings SET modLog=${message.channel.id} WHERE guildID=${message.guild.id}`);
      color = Bastion.colors.GREEN;
      modLogStats = Bastion.strings.info(message.guild.language, 'enableModerationLog', message.author.tag);
    }

    message.channel.send({
      embed: {
        color: color,
        description: modLogStats
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
  name: 'modLog',
  botPermission: '',
  userTextPermission: 'MANAGE_GUILD',
  userVoicePermission: '',
  usage: 'modLog',
  example: []
};
