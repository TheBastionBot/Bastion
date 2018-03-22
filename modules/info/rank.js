/**
 * @file rank command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.exec = async (Bastion, message, args) => {
  try {
    args = message.mentions.users.first() || message.author;
    let profile = await Bastion.db.get(`SELECT (SELECT COUNT(*) FROM profiles) AS total, (SELECT COUNT(*) FROM profiles AS p2 WHERE p2.xp * 1 > p1.xp * 1) AS rank FROM profiles as p1 WHERE p1.userID=${args.id}`), rank = 0;

    if (profile && profile.hasOwnProperty('rank')) {
      rank = parseInt(profile.rank) + 1;
    }

    let description = message.author.id === args.id ? `**${args.tag}** your rank is **${rank}** of ${profile.total}.` : `**${args.tag}**'s rank is **${rank}** of ${profile.total}.`;

    message.channel.send({
      embed: {
        color: Bastion.colors.BLUE,
        description: description
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
  name: 'rank',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'rank [@user-mention]',
  example: [ 'rank', 'rank @user#0001' ]
};
