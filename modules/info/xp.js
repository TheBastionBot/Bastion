/**
 * @file xp command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.exec = async (Bastion, message, args) => {
  try {
    args = message.mentions.users.first() || message.author;

    let profile = await Bastion.db.get(`SELECT xp FROM profiles WHERE userID=${args.id}`), xp = 0;

    if (profile && profile.xp) {
      xp = profile.xp;
    }

    let description = message.author.id === args.id ? `**${args.tag}** you have **${xp}** experience points.` : `**${args.tag}** has **${xp}** experience points.`;

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
  name: 'xp',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'xp [@user-mention]',
  example: [ 'xp', 'xp @user#0001' ]
};
