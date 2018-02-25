/**
 * @file inviteFilter
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

/**
 * Handles filtering of Discord server invites in messages
 * @param {Message} message Discord.js message object
 * @returns {Promise<true>} If the message was filtered
 */
module.exports = async message => {
  try {
    let query = `SELECT filterInvite, inviteFilterWhitelistChannels, inviteFilterWhitelistRoles FROM guildSettings LEFT OUTER JOIN whitelists ON guildSettings.guildID = whitelists.guildID WHERE guildSettings.guildId='${message.guild.id}'`;
    let guild = await message.client.db.get(query);

    // If invite filter is disabled, return
    if (!guild.filterInvite) return;
    // If the channel is whitelisted, return
    if (guild.inviteFilterWhitelistChannels) {
      let whitelistChannels = guild.inviteFilterWhitelistChannels.split(' ');
      if (whitelistChannels.includes(message.channel.id)) return;
    }
    // If the user is in a whitelisted role, return
    if (guild.inviteFilterWhitelistRoles) {
      let whitelistRoles = guild.inviteFilterWhitelistRoles.split(' ');
      for (let whitelistRole of whitelistRoles) {
        if (message.member.roles.has(whitelistRole)) return;
      }
    }
    // If the user has Manage Server permission, return
    if (message.member && message.member.hasPermission('MANAGE_GUILD')) return;

    // If message contains a discord invite, filter it
    if (hasDiscordInvite(message.content)) {
      return deleteInvite(message);
    }

    let links = message.content.match(/(http[s]?:\/\/)(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&/=]*)/gi);
    if (!links) return;

    for (let url of links) {
      url = await message.client.functions.followURL(url);

      if (hasDiscordInvite(url)) {
        return deleteInvite(message);
      }
    }
  }
  catch (e) {
    message.client.log.error(e);
  }
};

/**
 * Checks if a string contains a discord invite URL
 * @param {String} string string which needs to be checked for
 * @returns {Boolean} whether the string has invite URL or not
 */
function hasDiscordInvite(string) {
  let discordInvite = /(https:\/\/)?(www\.)?(discord\.gg|discord\.me|discordapp\.com\/invite|discord\.com\/invite)\/([a-z0-9-.]+)?/i;

  if (discordInvite.test(string)) return true;
  return false;
}

/**
 * Deletes the message with the invite URL (if Bastion has permission)
 * and warns the user
 * @param {String} message Discord.js message object
 * @returns {true} If the message was filtered
 */
function deleteInvite(message) {
  if (message.deletable) {
    message.delete().catch(() => {});
  }

  message.channel.send({
    embed: {
      color: message.client.colors.ORANGE,
      description: `${message.author} you are not allowed to post server invite links here.`
    }
  }).then(msg => {
    msg.delete(5000).catch(() => {});
  }).catch(e => {
    message.client.log.error(e);
  });
  return true;
}
