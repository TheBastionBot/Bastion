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
      suggestionChannelStats = 'Suggestion channel has beed removed. Users can now post suggestions in any channel.';
    }
    else {
      await Bastion.db.run(`UPDATE guildSettings SET suggestionChannel=${message.channel.id} WHERE guildID=${message.guild.id}`);
      color = Bastion.colors.GREEN;
      suggestionChannelStats = 'This channel has now been set as the suggestion channel. When users post a suggestions using the `suggest` command, it will be logged in this channel.';
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
  userTextPermission: 'ADMINISTRATOR',
  userVoicePermission: '',
  usage: 'suggestionChannel',
  example: []
};
