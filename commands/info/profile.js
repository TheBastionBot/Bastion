/**
 * @file profile command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

const specialIDs = xrequire('./assets/specialIDs.json');

exports.exec = async (Bastion, message, args) => {
  try {
    let user;
    if (message.mentions.users.size) {
      user = message.mentions.users.first();
    }
    else if (args.id) {
      user = await message.guild.fetchMember(args.id);
      if (user) {
        user = user.user;
      }
    }
    if (!user) {
      user = message.author;
    }

    let guildMemberModel = await Bastion.database.models.guildMember.findOne({
      attributes: Object.keys(Bastion.database.models.guildMember.attributes).concat([
        [ Bastion.database.literal(`(SELECT COUNT(*) FROM guildMembers AS member WHERE member.guildID = ${message.guild.id} AND member.experiencePoints * 1 > guildMember.experiencePoints * 1)`), 'rank' ]
      ]),
      where: {
        userID: user.id,
        guildID: message.guild.id
      }
    });

    let userModel = await Bastion.database.models.user.findOne({
      attributes: [ 'bio', 'birthDate', 'color', 'location' ],
      where: {
        userID: user.id
      }
    });

    if (!guildMemberModel) {
      /**
      * Error condition is encountered.
      * @fires error
      */
      return Bastion.emit('error', '', Bastion.i18n.error(message.guild.language, 'profileNotCreated', `<@${user.id}>`), message.channel);
    }

    let bio;
    if (userModel && userModel.dataValues.bio) {
      bio = await Bastion.methods.decodeString(userModel.dataValues.bio);
    }
    else {
      bio = `No bio has been set. ${user.id === message.author.id ? 'Set your bio using `setBio` command.' : ''}`;
    }

    let profileData = [
      {
        name: 'Bastion Currency',
        value: guildMemberModel.dataValues.bastionCurrencies,
        inline: true
      },
      {
        name: 'Rank',
        value: parseInt(guildMemberModel.dataValues.rank) + 1,
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

    message.channel.send({
      embed: {
        color: userModel.dataValues.color ? userModel.dataValues.color : Bastion.colors.BLUE,
        author: {
          name: user.tag,
          icon_url: await getUserIcon(user)
        },
        description: bio,
        fields: profileData,
        thumbnail: {
          url: user.displayAvatarURL
        },
        footer: {
          text: `${guildMemberModel.dataValues.reputations} Reputation${parseInt(guildMemberModel.dataValues.reputations) === 1 ? '' : 's'}`
        }
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
 * @param {User} user The user for which we need to get the icon
 * @returns {String} The url of the user's staff icon
 */
async function getUserIcon(user) {
  try {
    const bastionGuildID = specialIDs.bastionGuild;
    const bastionGuild = user.client.guilds.get(bastionGuildID);
    if (!bastionGuild) return;
    const bastionGuildMember = await bastionGuild.fetchMember(user.id);
    if (!bastionGuildMember) return;

    const devRoleID = specialIDs.developerRole;
    const contributorsRoleID = specialIDs.contributorsRole;
    const donorsRoleID = specialIDs.donorsRole;
    const modsRoleID = specialIDs.modsRole;
    const patronsRoleID = specialIDs.patronsRole;
    const supportRoleID = specialIDs.supportRole;
    const testersRoleID = specialIDs.testersRole;
    const translatorsRoleID = specialIDs.translatorsRole;

    const devIcon = 'https://i.imgur.com/ThSx8bZ.png';
    const modsIcon = 'https://i.imgur.com/vntgkTs.png';
    const contributorsIcon = 'https://i.imgur.com/kH49M8d.png';
    const donorsIcon = 'https://i.imgur.com/0Jfh057.png';
    const patronsIcon = 'https://i.imgur.com/VZePUfw.png';
    const supportIcon = 'http://i.imgur.com/HM9UD6w.png';
    const testersIcon = 'https://i.imgur.com/fVIW1Uy.png';
    const translatorsIcon = 'https://i.imgur.com/COwpvnK.png';
    // const partners = 'https://cdn.discordapp.com/emojis/314068430556758017.png';
    // const hype = 'https://cdn.discordapp.com/emojis/314068430854684672.png';
    // const nitro = 'https://cdn.discordapp.com/emojis/314068430611415041.png';

    if (bastionGuildMember.roles.has(devRoleID)) {
      return devIcon;
    }
    if (bastionGuildMember.roles.has(modsRoleID)) {
      return modsIcon;
    }
    else if (bastionGuildMember.roles.has(contributorsRoleID)) {
      return contributorsIcon;
    }
    else if (bastionGuildMember.roles.has(supportRoleID)) {
      return supportIcon;
    }
    else if (bastionGuildMember.roles.has(patronsRoleID)) {
      return patronsIcon;
    }
    else if (bastionGuildMember.roles.has(donorsRoleID)) {
      return donorsIcon;
    }
    else if (bastionGuildMember.roles.has(testersRoleID)) {
      return testersIcon;
    }
    else if (bastionGuildMember.roles.has(translatorsRoleID)) {
      return translatorsIcon;
    }
  }
  catch (e) {
    process.stderr.write(`${e}\n`);
  }
}
