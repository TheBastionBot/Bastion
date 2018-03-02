/**
 * @file greetPrivate command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.exec = async (Bastion, message) => {
  try {
    let guildSettings = await Bastion.db.get(`SELECT greetPrivate FROM guildSettings WHERE guildID=${message.guild.id}`);

    let color, greetPrivateStats;
    if (guildSettings.greetPrivate) {
      await Bastion.db.run(`UPDATE guildSettings SET greetPrivate=0 WHERE guildID=${message.guild.id}`);
      color = Bastion.colors.RED;
      greetPrivateStats = Bastion.strings.info(message.guild.language, 'disablePrivateGreetingMessages', message.author.tag);
    }
    else {
      await Bastion.db.run(`UPDATE guildSettings SET greetPrivate=1 WHERE guildID=${message.guild.id}`);
      color = Bastion.colors.GREEN;
      greetPrivateStats = Bastion.strings.info(message.guild.language, 'enablePrivateGreetingMessages', message.author.tag);
    }

    message.channel.send({
      embed: {
        color: color,
        description: greetPrivateStats
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
  aliases: [ 'greetprv' ],
  enabled: true
};

exports.help = {
  name: 'greetPrivate',
  botPermission: '',
  userTextPermission: 'MANAGE_GUILD',
  userVoicePermission: '',
  usage: 'greetPrivate',
  example: []
};
