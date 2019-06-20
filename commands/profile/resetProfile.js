/**
 * @file resetProfile command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

exports.exec = async (Bastion, message, args) => {
  let guildMemberModel = await Bastion.database.models.guildMember.describe();

  let deletionMessage;

  if (args.user && message.member.hasPermission('MANAGE_GUILD')) {
    await Bastion.database.models.guildMember.update({
      bastionCurrencies: guildMemberModel.bastionCurrencies.defaultValue,
      experiencePoints: guildMemberModel.experiencePoints.defaultValue,
      level: guildMemberModel.level.defaultValue,
      karma: guildMemberModel.karma.defaultValue,
      lastClaimed: guildMemberModel.lastClaimed.defaultValue,
      claimStreak: guildMemberModel.claimStreak.defaultValue
    },
    {
      where: {
        guildID: message.guild.id,
        userID: args.user
      },
      fields: [ 'bastionCurrencies', 'experiencePoints', 'level', 'karma', 'lastClaimed', 'claimStreak' ]
    });

    deletionMessage = `You've successfully reset the Bastion profile of <@${args.user}>.`;
  }
  else if (args.all && message.member.hasPermission('MANAGE_GUILD')) {
    await Bastion.database.models.guildMember.update({
      bastionCurrencies: guildMemberModel.bastionCurrencies.defaultValue,
      experiencePoints: guildMemberModel.experiencePoints.defaultValue,
      level: guildMemberModel.level.defaultValue,
      karma: guildMemberModel.karma.defaultValue,
      lastClaimed: guildMemberModel.lastClaimed.defaultValue,
      claimStreak: guildMemberModel.claimStreak.defaultValue
    },
    {
      where: {
        guildID: message.guild.id
      },
      fields: [ 'bastionCurrencies', 'experiencePoints', 'level', 'karma', 'lastClaimed', 'claimStreak' ]
    });

    deletionMessage = 'You\'ve successfully reset every Bastion profiles.';
  }
  else {
    await Bastion.database.models.guildMember.update({
      bastionCurrencies: guildMemberModel.bastionCurrencies.defaultValue,
      experiencePoints: guildMemberModel.experiencePoints.defaultValue,
      level: guildMemberModel.level.defaultValue,
      karma: guildMemberModel.karma.defaultValue,
      lastClaimed: guildMemberModel.lastClaimed.defaultValue,
      claimStreak: guildMemberModel.claimStreak.defaultValue
    },
    {
      where: {
        guildID: message.guild.id,
        userID: message.author.id
      },
      fields: [ 'bastionCurrencies', 'experiencePoints', 'level', 'karma', 'lastClaimed', 'claimStreak' ]
    });

    deletionMessage = 'You\'ve successfully reset your Bastion profile.';
  }

  await message.channel.send({
    embed: {
      color: Bastion.colors.GREEN,
      description: deletionMessage
    }
  }).catch(e => {
    Bastion.log.error(e);
  });
};

exports.config = {
  aliases: [],
  enabled: true,
  argsDefinitions: [
    { name: 'user', type: String, alias: 'u', defaultOption: true },
    { name: 'all', type: Boolean, alias: 'a' }
  ]
};

exports.help = {
  name: 'resetProfile',
  description: 'Resets all your profile data, inluding all the XP, level, karma and currency that you\'ve earned. If you have Manage Server permission, you can reset anyone and everyone\'s profiles.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'resetProfile [ USER_ID | --all ]',
  example: [ 'resetProfile', 'resetProfile 267035345537728512', 'resetProfile --all' ]
};
