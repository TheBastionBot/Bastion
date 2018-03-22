/**
 * @file greet command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.exec = async (Bastion, message) => {
  try {
    let guildSettings = await Bastion.db.get(`SELECT greet FROM guildSettings WHERE guildID=${message.guild.id}`);

    let color, greetStats;
    if (guildSettings.greet === message.channel.id) {
      Bastion.db.run(`UPDATE guildSettings SET greet=null WHERE guildID=${message.guild.id}`);
      color = Bastion.colors.RED;
      greetStats = Bastion.strings.info(message.guild.language, 'disableGreetingMessages', message.author.tag);
    }
    else {
      Bastion.db.run(`UPDATE guildSettings SET greet=${message.channel.id} WHERE guildID=${message.guild.id}`);
      color = Bastion.colors.GREEN;
      greetStats = Bastion.strings.info(message.guild.language, 'enableGreetingMessages', message.author.tag);
    }

    message.channel.send({
      embed: {
        color: color,
        description: greetStats
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
  name: 'greet',
  botPermission: '',
  userTextPermission: 'MANAGE_GUILD',
  userVoicePermission: '',
  usage: 'greet',
  example: []
};
