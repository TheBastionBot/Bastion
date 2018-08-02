/**
 * @file xp command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

exports.exec = async (Bastion, message, args) => {
  try {
    args = message.mentions.users.first() || message.author;

    let guildMemberModel = await Bastion.database.models.guildMember.findOne({
      attributes: [ 'experiencePoints' ],
      where: {
        userID: args.id,
        guildID: message.guild.id
      }
    });
    let xp = 0;

    if (guildMemberModel) {
      xp = guildMemberModel.dataValues.experiencePoints;
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
  description: 'Shows the experience points of the specified user\'s account.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'xp [@user-mention]',
  example: [ 'xp', 'xp @user#0001' ]
};
