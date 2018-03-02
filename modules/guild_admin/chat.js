/**
 * @file chat command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.exec = async (Bastion, message) => {
  try {
    if (!Bastion.credentials.cleverbotAPIkey) {
      /**
      * Error condition is encountered.
      * @fires error
      */
      return Bastion.emit('error', Bastion.strings.error(message.guild.language, 'noCredentials'), Bastion.strings.error(message.guild.language, 'noCredentials', true, 'Cleverbot API'), message.channel);
    }

    let guildSettings = await Bastion.db.get(`SELECT chat FROM guildSettings WHERE guildID=${message.guild.id}`);

    let color, chatStats;
    if (guildSettings.chat) {
      await Bastion.db.run(`UPDATE guildSettings SET chat=0 WHERE guildID=${message.guild.id}`);
      color = Bastion.colors.RED;
      chatStats = Bastion.strings.info(message.guild.language, 'disableChat', message.author.tag);
    }
    else {
      await Bastion.db.run(`UPDATE guildSettings SET chat=1 WHERE guildID=${message.guild.id}`);
      color = Bastion.colors.GREEN;
      chatStats = Bastion.strings.info(message.guild.language, 'enableChat', message.author.tag);
    }

    message.channel.send({
      embed: {
        color: color,
        description: chatStats
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
  name: 'chat',
  botPermission: '',
  userTextPermission: 'MANAGE_GUILD',
  userVoicePermission: '',
  usage: 'chat',
  example: []
};
