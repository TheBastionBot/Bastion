/**
 * @file listBans command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

exports.exec = async (Bastion, message, args) => {
  let bannedUsers = await message.guild.fetchBans(true);

  if (!bannedUsers.size) {
    return await message.channel.send({
      embed: {
        color: Bastion.colors.GREEN,
        description: 'Members of your server look pretty decent. No one has been banned yet!'
      }
    });
  }

  let noOfPages = bannedUsers.size / 10;
  let i = (args.page > 0 && args.page < noOfPages + 1) ? args.page : 1;
  i = i - 1;


  let bannedUsersList = [];
  for (let bannedUser of bannedUsers.values()) {
    bannedUsersList.push({
      name: `${bannedUser.user.username}#${bannedUser.user.discriminator} / ${bannedUser.user.id}`,
      value: bannedUser.reason || 'No reason given'
    });
  }
  bannedUsersList = bannedUsersList.slice(i * 10, (i * 10) + 10);


  await message.channel.send({
    embed: {
      color: Bastion.colors.ORANGE,
      title: 'Banned Users',
      description: `Users banned from ${message.guild.name}`,
      fields: bannedUsersList,
      footer: {
        text: `Page: ${i + 1} of ${noOfPages > parseInt(noOfPages) ? parseInt(noOfPages) + 1 : parseInt(noOfPages)}`
      }
    }
  });
};

exports.config = {
  aliases: [ 'bans' ],
  enabled: true,
  argsDefinitions: [
    { name: 'page', type: Number, alias: 'p', defaultOption: true, defaultValue: 1 }
  ]
};

exports.help = {
  name: 'listBans',
  description: 'Lists all the banned users of the Discord Server with the reason for the ban.',
  botPermission: '',
  userTextPermission: 'BAN_MEMBERS',
  userVoicePermission: '',
  usage: 'listBans [-p PAGE_NO]',
  example: [ 'listBans', 'listBans -p 13' ]
};
