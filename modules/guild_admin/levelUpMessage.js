/**
 * @file levelUpMessage command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.exec = async (Bastion, message) => {
  try {
    let guildSettings = await Bastion.db.get(`SELECT levelUpMessage FROM guildSettings WHERE guildID=${message.guild.id}`);

    let color, levelUpMessageStats;
    if (guildSettings.levelUpMessage) {
      await Bastion.db.run(`UPDATE guildSettings SET levelUpMessage=0 WHERE guildID=${message.guild.id}`);
      color = Bastion.colors.RED;
      levelUpMessageStats = Bastion.strings.info(message.guild.language, 'disableLevelUpMessages', message.author.tag);
    }
    else {
      await Bastion.db.run(`UPDATE guildSettings SET levelUpMessage=1 WHERE guildID=${message.guild.id}`);
      color = Bastion.colors.GREEN;
      levelUpMessageStats = Bastion.strings.info(message.guild.language, 'enableLevelUpMessages', message.author.tag);
    }

    message.channel.send({
      embed: {
        color: color,
        description: levelUpMessageStats
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
  aliases: [ 'lvlupmsg' ],
  enabled: true
};

exports.help = {
  name: 'levelUpMessage',
  botPermission: '',
  userTextPermission: 'MANAGE_GUILD',
  userVoicePermission: '',
  usage: 'levelUpMessage',
  example: []
};
