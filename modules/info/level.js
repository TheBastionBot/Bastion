/**
 * @file level command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.exec = async (Bastion, message, args) => {
  try {
    args = message.mentions.users.first() || message.author;

    let profile = await Bastion.db.get(`SELECT level FROM profiles WHERE userID=${args.id}`), level = 0;

    if (profile && profile.level) {
      level = profile.level;
    }

    let description = message.author.id === args.id ? `**${args.tag}** you are currently in level **${level}**.` : `**${args.tag}** is currently in level **${level}**.`;

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
  aliases: [ 'lvl' ],
  enabled: true
};

exports.help = {
  name: 'level',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'level [@user-mention]',
  example: [ 'level', 'level @user#0001' ]
};
