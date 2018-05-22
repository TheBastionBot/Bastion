/**
 * @file rank command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

exports.exec = async (Bastion, message, args) => {
  try {
    args = message.mentions.users.first() || message.author;
    let guildMemberModel = await Bastion.database.models.guildMember.findOne({
      attributes: [
        [ Bastion.database.literal('(SELECT COUNT(*) FROM guildMembers)'), 'total' ],
        [ Bastion.database.literal('(SELECT COUNT(*) FROM guildMembers AS member WHERE member.experiencePoints * 1 > guildMember.experiencePoints * 1)'), 'rank' ]
      ],
      where: {
        userID: args.id,
        guildID: message.guild.id
      }
    });
    let rank = 0;

    if (guildMemberModel) {
      rank = parseInt(guildMemberModel.dataValues.rank) + 1;
    }

    let description = message.author.id === args.id ? `**${args.tag}** your rank is **${rank}** of ${guildMemberModel.dataValues.total}.` : `**${args.tag}**'s rank is **${rank}** of ${guildMemberModel.dataValues.total}.`;

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
  description: 'Shows the rank of the specified user\'s account.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'rank [@user-mention]',
  example: [ 'rank', 'rank @user#0001' ]
};
