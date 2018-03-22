/**
 * @file farewell command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */
// I don't understand why this is even needed, but some fellows like this.

exports.exec = async (Bastion, message) => {
  try {
    let guildSettings = await Bastion.db.get(`SELECT farewell FROM guildSettings WHERE guildID=${message.guild.id}`);

    let color, farewellStats;
    if (guildSettings.farewell === message.channel.id) {
      await Bastion.db.run(`UPDATE guildSettings SET farewell=null WHERE guildID=${message.guild.id}`);
      color = Bastion.colors.RED;
      farewellStats = Bastion.strings.info(message.guild.language, 'disableFarewellMessages', message.author.tag);
    }
    else {
      await Bastion.db.run(`UPDATE guildSettings SET farewell=${message.channel.id} WHERE guildID=${message.guild.id}`);
      color = Bastion.colors.GREEN;
      farewellStats = Bastion.strings.info(message.guild.language, 'enableFarewellMessages', message.author.tag);
    }

    message.channel.send({
      embed: {
        color: color,
        description: farewellStats
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
  name: 'farewell',
  botPermission: '',
  userTextPermission: 'MANAGE_GUILD',
  userVoicePermission: '',
  usage: 'farewell',
  example: []
};
