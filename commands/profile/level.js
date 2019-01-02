/**
 * @file level command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

exports.exec = async (Bastion, message, args) => {
  args = message.mentions.users.first() || message.author;

  let guildMemberModel = await Bastion.database.models.guildMember.findOne({
    attributes: [ 'experiencePoints', 'level' ],
    where: {
      userID: args.id,
      guildID: message.guild.id
    }
  });
  let level = 0, xp = 0;

  if (guildMemberModel) {
    level = guildMemberModel.dataValues.level;
    xp = guildMemberModel.dataValues.experiencePoints;
  }

  let description = message.author.id === args.id ? `**${args.tag}** you are currently in level **${level}**.` : `**${args.tag}** is currently in level **${level}**.`;
  let footer = message.author.id === args.id && guildMemberModel.dataValues.experiencePoints !== '44444444444444' ? `Wanna go to the next level? Just gain ${Bastion.methods.getRequiredExpForLevel(parseInt(level, 10) + 1) - xp + 1} more XP.` : null;

  await message.channel.send({
    embed: {
      color: Bastion.colors.BLUE,
      description: description,
      footer: {
        text: footer
      }
    }
  });
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
