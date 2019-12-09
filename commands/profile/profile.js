/**
 * @file profile command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

exports.exec = async (Bastion, message, args) => {
  let user;
  if (message.mentions.users.size) {
    user = message.mentions.users.first();
  }
  else if (args.id) {
    user = await Bastion.utils.fetchMember(message.guild, args.id);
    if (user) {
      user = user.user;
    }
  }
  if (!user) {
    user = message.author;
  }

  let guildMemberModel = await Bastion.database.models.guildMember.findOne({
    attributes: [ 'userID', 'guildID', 'bastionCurrencies', 'experiencePoints', 'level', 'karma' ].concat([
      [ Bastion.database.literal(`(SELECT COUNT(*) FROM guildMembers AS member WHERE member.guildID = ${message.guild.id} AND member.experiencePoints * 1 > guildMember.experiencePoints * 1)`), 'rank' ]
    ]),
    where: {
      userID: user.id,
      guildID: message.guild.id
    }
  });

  let userModel = await Bastion.database.models.user.findOne({
    attributes: [ 'avatar', 'info', 'birthDate', 'color', 'location' ],
    where: {
      userID: user.id
    }
  });

  if (!guildMemberModel) {
    return Bastion.emit('error', '', Bastion.i18n.error(message.guild.language, 'profileNotCreated', `<@${user.id}>`), message.channel);
  }

  let info;
  if (userModel && userModel.dataValues.info) {
    info = await Bastion.utils.decompressString(userModel.dataValues.info);
  }
  else {
    info = `No info has been set. ${user.id === message.author.id ? 'Set your info using `setInfo` command.' : ''}`;
  }

  let rank = parseInt(guildMemberModel.dataValues.rank) + 1;

  let requiredExp = {
    currentLevel: Bastion.methods.getRequiredExpForLevel(parseInt(guildMemberModel.dataValues.level, 10)),
    nextLevel: Bastion.methods.getRequiredExpForLevel(parseInt(guildMemberModel.dataValues.level, 10) + 1)
  };

  let totalRequiredExp = {
    currentLevel: guildMemberModel.dataValues.experiencePoints - requiredExp.currentLevel,
    nextLevel: requiredExp.nextLevel - requiredExp.currentLevel
  };

  let progress = totalRequiredExp.currentLevel / totalRequiredExp.nextLevel * 100;

  let profileData = [
    {
      name: 'Bastion Currency',
      value: guildMemberModel.dataValues.bastionCurrencies,
      inline: true
    },
    {
      name: 'Rank',
      value: rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : rank,
      inline: true
    },
    {
      name: 'Experience Points',
      value: guildMemberModel.dataValues.experiencePoints,
      inline: true
    },
    {
      name: 'Level',
      value: guildMemberModel.dataValues.level,
      inline: true
    },
    {
      name: `Progress - ${totalRequiredExp.currentLevel} / ${totalRequiredExp.nextLevel} - ${Math.round(progress)}%`,
      value: Bastion.methods.generateProgressBar(progress, 35)
    }
  ];

  if (userModel && userModel.dataValues.birthDate) {
    profileData.push({
      name: 'Birthday',
      value: new Date(userModel.dataValues.birthDate).toDateString().split(' ').splice(1, 2).join(' '),
      inline: true
    });
  }
  if (userModel && userModel.dataValues.location) {
    profileData.push({
      name: 'Location',
      value: userModel.dataValues.location,
      inline: true
    });
  }

  await message.channel.send({
    embed: {
      color: userModel.dataValues.color ? userModel.dataValues.color : Bastion.colors.BLUE,
      author: {
        name: user.tag,
        icon_url: await getUserIcon(Bastion.hq, user)
      },
      description: info,
      fields: profileData,
      thumbnail: {
        url: userModel && userModel.dataValues.avatar ? userModel.dataValues.avatar : user.displayAvatarURL
      },
      footer: {
        text: `${guildMemberModel.dataValues.karma} Karma`
      }
    }
  });
};

exports.config = {
  aliases: [],
  enabled: true,
  argsDefinitions: [
    { name: 'id', type: String, defaultOption: true }
  ]
};

exports.help = {
  name: 'profile',
  description: 'Shows Bastion user profile of a specified user of your Discord server.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'profile [@USER_MENTION | USER_ID]',
  example: [ 'profle', 'profile @Bastion#0001', 'profile 167433345337713651' ]
};

/**
 * Returns the provided user's staff icon
 * @function getUserIcon
 * @param {any} hq Bastion HQ
 * @param {User} user The user for which we need to get the icon
 * @returns {String} The url of the user's staff icon
 */
async function getUserIcon(hq, user) {
  try {
    const bastionGuild = user.client.guilds.get(hq.id);
    if (!bastionGuild) return;
    const bastionGuildMember = await user.client.utils.fetchMember(bastionGuild, user.id);
    if (!bastionGuildMember) return;

    if (bastionGuildMember.roles.has(hq.roles.developer.id)) {
      return hq.roles.developer.icon;
    }
    if (bastionGuildMember.roles.has(hq.roles.moderators.id)) {
      return hq.roles.moderators.icon;
    }
    else if (bastionGuildMember.roles.has(hq.roles.contributors.id)) {
      return hq.roles.contributors.icon;
    }
    else if (bastionGuildMember.roles.has(hq.roles.support.id)) {
      return hq.roles.support.icon;
    }
    else if (bastionGuildMember.roles.has(hq.roles.patrons.id)) {
      return hq.roles.patrons.icon;
    }
    else if (bastionGuildMember.roles.has(hq.roles.donors.id)) {
      return hq.roles.donors.icon;
    }
    else if (bastionGuildMember.roles.has(hq.roles.testers.id)) {
      return hq.roles.testers.icon;
    }
    else if (bastionGuildMember.roles.has(hq.roles.translators.id)) {
      return hq.roles.translators.icon;
    }
  }
  catch (e) {
    process.stderr.write(`${e}\n`);
  }
}
