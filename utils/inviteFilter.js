/**
 * @file inviteFilter
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

/**
 * Handles filtering of Discord server invites in messages
 * @param {Message} message Discord.js message object
 * @returns {void}
 */
module.exports = async message => {
  try {
    let guild = await message.client.db.get(`SELECT filterInvite FROM guildSettings WHERE guildID=${message.guild.id}`);

    if (guild.filterInvite !== 'true' || message.guild.members.get(message.author.id).hasPermission('ADMINISTRATOR')) return;

    if (hasDiscordInvite(message.content)) {
      deleteInvite(message);
    }

    let links = message.content.match(/(http[s]?:\/\/)(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&/=]*)/gi);
    if (!links) return;

    for (let url of links) {
      url = await message.client.functions.followURL(url);

      if (hasDiscordInvite(url)) {
        deleteInvite(message);
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
 * @returns {void}
 */
function deleteInvite(message) {
  if (message.deletable) {
    message.delete().catch(e => {
      message.client.log.error(e);
    });
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
}
