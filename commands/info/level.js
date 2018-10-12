/**
 * @file level command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

exports.exec = async (Bastion, message, args) => {
  try {
    args = message.mentions.users.first() || message.author;

    let guildMemberModel = await Bastion.database.models.guildMember.findOne({
      attributes: [ 'level' ],
      where: {
        userID: args.id,
        guildID: message.guild.id
      }
    });
    let level = 0;

    if (guildMemberModel && guildMemberModel.dataValues.level) {
      level = guildMemberModel.dataValues.level;
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
  description: 'Shows the current level of the specified user\'s account.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'level [@user-mention]',
  example: [ 'level', 'level @user#0001' ]
};
