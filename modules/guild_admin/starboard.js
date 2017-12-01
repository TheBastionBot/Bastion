/**
 * @file starboard command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.exec = async (Bastion, message) => {
  try {
    let guildSettings = await Bastion.db.get(`SELECT starboard FROM guildSettings WHERE guildID=${message.guild.id}`);

    let color, starboardStats;
    if (guildSettings.starboard) {
      await Bastion.db.run(`UPDATE guildSettings SET starboard=null WHERE guildID=${message.guild.id}`);
      color = Bastion.colors.RED;
      starboardStats = 'Starboard is now disabled.';
    }
    else {
      await Bastion.db.run(`UPDATE guildSettings SET starboard=${message.channel.id} WHERE guildID=${message.guild.id}`);
      color = Bastion.colors.GREEN;
      starboardStats = 'Starboard is now enabled in this channel.';
    }

    message.channel.send({
      embed: {
        color: color,
        description: starboardStats
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
  name: 'starboard',
  botPermission: '',
  userTextPermission: 'ADMINISTRATOR',
  userVoicePermission: '',
  usage: 'starboard',
  example: []
};
