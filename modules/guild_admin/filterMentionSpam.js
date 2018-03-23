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
      if (!args.action || ![ 'kick', 'ban' ].includes(args.action = args.action.toLowerCase())) {
        args.action = null;
      }

      await Bastion.database.models.guild.update({
        filterMentions: true,
        mentionSpamThreshold: args.amount,
        mentionSpamAction: args.action
      },
      {
        where: {
          guildID: message.guild.id
        },
        fields: [ 'filterMentions', 'mentionSpamThreshold', 'mentionSpamAction' ]
      });

      color = Bastion.colors.GREEN;
      mentionSpamStats = Bastion.strings.info(message.guild.language, 'enableMentionSpamFilter', message.author.tag, args.amount, args.action);
    }
    else {
      await Bastion.database.models.guild.update({
        filterMentions: false,
        mentionSpamThreshold: null,
        mentionSpamAction: null
      },
      {
        where: {
          guildID: message.guild.id
        },
        fields: [ 'filterMentions', 'mentionSpamThreshold', 'mentionSpamAction' ]
      });
      color = Bastion.colors.RED;
      mentionSpamStats = Bastion.strings.info(message.guild.language, 'disableMentionSpamFilter', message.author.tag);
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
    { name: 'amount', type: Number, defaultOption: true },
    { name: 'action', type: String, alias: 'a' }
  ]
};

exports.help = {
  name: 'filterMentionSpam',
  botPermission: '',
  userTextPermission: 'MANAGE_GUILD',
  userVoicePermission: '',
  usage: 'filterMentionSpam [ MENTION_THRESHOLD [ --action KICK|BAN ] ]',
  example: [ 'filterMentionSpam 5', 'filterMentionSpam 5 --action kick', 'filterMentionSpam' ]
};
