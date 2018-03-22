/**
 * @file suggestionChannel command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.exec = async (Bastion, message) => {
  try {
    let guildSettings = await Bastion.db.get(`SELECT suggestionChannel FROM guildSettings WHERE guildID=${message.guild.id}`);

    let color, suggestionChannelStats;
    if (guildSettings.suggestionChannel) {
      await Bastion.db.run(`UPDATE guildSettings SET suggestionChannel=null WHERE guildID=${message.guild.id}`);
      color = Bastion.colors.RED;
      suggestionChannelStats = Bastion.strings.info(message.guild.language, 'disableSuggestionChannel', message.author.tag);
    }
    else {
      await Bastion.db.run(`UPDATE guildSettings SET suggestionChannel=${message.channel.id} WHERE guildID=${message.guild.id}`);
      color = Bastion.colors.GREEN;
      suggestionChannelStats = Bastion.strings.info(message.guild.language, 'enableSuggestionChannel', message.author.tag);
    }

    message.channel.send({
      embed: {
        color: color,
        description: suggestionChannelStats
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
  name: 'suggestionChannel',
  botPermission: '',
  userTextPermission: 'MANAGE_GUILD',
  userVoicePermission: '',
  usage: 'suggestionChannel',
  example: []
};
