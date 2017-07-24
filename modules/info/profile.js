/**
 * @file profile command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const string = require('../../handlers/languageHandler');
const specialIDs = require('../../data/specialIDs.json');

exports.run = async (Bastion, message, args) => {
  if (!(args = message.mentions.users.first())) {
    args = message.author;
  }

  let profile = await Bastion.db.get(`SELECT p1.*, (SELECT COUNT(*) FROM profiles AS p2 WHERE p2.xp>p1.xp) AS rank FROM profiles as p1 WHERE p1.userID=${args.id}`).catch(e => {
    Bastion.log.error(e);
  });

  if (!profile) {
    if (args === message.author) {
      return message.channel.send({
        embed: {
          color: Bastion.colors.green,
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
    return Bastion.emit('error', string('notFound', 'errors'), string('profileNotCreated', 'errorMessage', `<@${args.id}>`), message.channel);
  }

  message.channel.send({
    embed: {
      color: Bastion.colors.blue,
      author: {
        name: args.tag,
        icon_url: getUserIcon(args)
      },
      description: profile.bio || `No bio has been set. ${args.id === message.author.id ? 'Set your bio using `setBio` command.' : ''}`,
      fields: [
        {
          name: 'Bastion Currency',
          value: profile.bastionCurrencies,
          inline: true
        },
        {
          name: 'Rank',
          value: profile.rank + 1,
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
      }
    }
  }).catch(e => {
    Bastion.log.error(e);
  });
};

exports.config = {
  aliases: [],
  enabled: true
};

exports.help = {
  name: 'profile',
  description: string('profile', 'commandDescription'),
  botPermission: '',
  userPermission: '',
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
  const creatorRoleID = specialIDs.developerRole;
  const devsRoleID = specialIDs.contributorsRole;
  const donorsRoleID = specialIDs.donorsRole;
  const patronsRoleID = specialIDs.patronsRole;
  const supportRoleID = specialIDs.supportRole;
  const testersRoleID = specialIDs.testersRole;
  const translatorsRoleID = specialIDs.translatorsRole;

  const devsIcon = 'https://cdn.discordapp.com/emojis/314068430787706880.png';
  const donorsIcon = 'https://i.imgur.com/sCbiaOK.png';
  const patronsIcon = 'https://c5.patreon.com/external/logo/downloads_logomark_color_on_coral.png';
  const supportIcon = 'https://i.imgur.com/1a0sa8R.png';
  const testersIcon = 'https://i.imgur.com/3lwMiOo.png';
  const translatorsIcon = 'https://i.imgur.com/RUOrraz.png';
  // const partners = 'https://cdn.discordapp.com/emojis/314068430556758017.png';
  // const hype = 'https://cdn.discordapp.com/emojis/314068430854684672.png';
  // const nitro = 'https://cdn.discordapp.com/emojis/314068430611415041.png';

  if (bastionGuildMember.roles.has(creatorRoleID)) {
    return devsIcon;
  }
  else if (bastionGuildMember.roles.has(devsRoleID)) {
    return devsIcon;
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
