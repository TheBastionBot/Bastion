/**
 * @file profile command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const specialIDs = require('../../data/specialIDs.json');

exports.run = async (Bastion, message, args) => {
  if (!(args = message.mentions.users.first())) {
    args = message.author;
  }

  try {
    let profile = await Bastion.db.get(`SELECT p1.*, (SELECT COUNT(*) FROM profiles AS p2 WHERE p2.xp * 1 > p1.xp * 1) AS rank FROM profiles as p1 WHERE p1.userID=${args.id}`);

    if (!profile) {
      if (args === message.author) {
        return message.channel.send({
          embed: {
            color: Bastion.colors.GREEN,
            description: `Your profile is now created, <@${args.id}>`
          }
        }).catch(e => {
          Bastion.log.error(e);
        });
      }

      /**
      * Error condition is encountered.
      * @fires error
      */
      return Bastion.emit('error', Bastion.strings.error(message.guild.language, 'notFound'), Bastion.strings.error(message.guild.language, 'profileNotCreated', true, `<@${args.id}>`), message.channel);
    }
    if (profile.bio) {
      profile.bio = await Bastion.functions.decodeString(profile.bio);
    }
    else {
      profile.bio = `No bio has been set. ${args.id === message.author.id ? 'Set your bio using `setBio` command.' : ''}`;
    }

    message.channel.send({
      embed: {
        color: Bastion.colors.BLUE,
        author: {
          name: args.tag,
          icon_url: getUserIcon(args)
        },
        description: profile.bio,
        fields: [
          {
            name: 'Bastion Currency',
            value: profile.bastionCurrencies,
            inline: true
          },
          {
            name: 'Rank',
            value: parseInt(profile.rank) + 1,
            inline: true
          },
          {
            name: 'Experience Points',
            value: profile.xp,
            inline: true
          },
          {
            name: 'Level',
            value: profile.level,
            inline: true
          }
        ],
        thumbnail: {
          url: args.displayAvatarURL
        },
        footer: {
          text: `${profile.reputation} Reputation${parseInt(profile.reputation) === 1 ? '' : 's'}`
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
  enabled: true
};

exports.help = {
  name: 'profile',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'profile [@user-mention]',
  example: [ 'profle', 'profile @user#0001' ]
};

/**
 * Returns the provided user's staff icon
 * @function getUserIcon
 * @param {User} user The user for which we need to get the icon
 * @returns {String} The url of the user's staff icon
 */
function getUserIcon(user) {
  const bastionGuildID = specialIDs.bastionGuild;
  const bastionGuild = user.client.guilds.get(bastionGuildID);
  if (!bastionGuild) return;
  const bastionGuildMember = bastionGuild.members.get(user.id);
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
