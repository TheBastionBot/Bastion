/**
 * @file filterMentionSpam command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.exec = async (Bastion, message, args) => {
  try {
    args.amount = Math.abs(args.amount);

    let color, mentionSpamStats;
    if (args.amount) {
      await Bastion.db.run(`UPDATE guildSettings SET mentionSpamThreshold=${args.amount} WHERE guildID=${message.guild.id}`);
      color = Bastion.colors.GREEN;
      mentionSpamStats = `Auto moderation of mention spam is now enabled and the threshold is set to ${args.amount} mentions. Beware spammers!`;
    }
    else {
      await Bastion.db.run(`UPDATE guildSettings SET mentionSpamThreshold=NULL WHERE guildID=${message.guild.id}`);
      color = Bastion.colors.RED;
      mentionSpamStats = 'Auto moderation of mention spam is now disabled.';
    }

    message.channel.send({
      embed: {
        color: color,
        description: mentionSpamStats
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
  enabled: true,
  argsDefinitions: [
    { name: 'amount', type: Number, defaultOption: true }
  ]
};

exports.help = {
  name: 'filterMentionSpam',
  botPermission: '',
  userTextPermission: 'ADMINISTRATOR',
  userVoicePermission: '',
  usage: 'filterMentionSpam [ MENTION_THRESHOLD ]',
  example: [ 'filterMentionSpam 5', 'filterMentionSpam' ]
};
