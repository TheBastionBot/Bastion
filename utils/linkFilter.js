/**
 * @file linkFilter
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

/**
 * Handles filtering of links in messages
 * @param {Message} message Discord.js message object
 * @returns {Promise<true>} If the message was filtered
 */
module.exports = async message => {
  try {
    let query = `SELECT filterLink, linkFilterWhitelistChannels, linkFilterWhitelistRoles, whitelistDomains FROM guildSettings LEFT OUTER JOIN whitelists ON guildSettings.guildID = whitelists.guildID WHERE guildSettings.guildId='${message.guild.id}'`;
    let guild = await message.client.db.get(query), filtered = false;

    // If link filter is disabled, return
    if (!guild.filterLink) return;
    // If the channel is whitelisted, return
    if (guild.linkFilterWhitelistChannels) {
      let whitelistChannels = guild.linkFilterWhitelistChannels.split(' ');
      if (whitelistChannels.includes(message.channel.id)) return;
    }
    // If the user is in a whitelisted role, return
    if (guild.linkFilterWhitelistRoles) {
      let whitelistRoles = guild.linkFilterWhitelistRoles.split(' ');
      for (let whitelistRole of whitelistRoles) {
        if (message.member.roles.has(whitelistRole)) return;
      }
    }
    // If the user has Manage Server permission, return
    if (message.member && message.member.hasPermission('MANAGE_GUILD')) return;

    let whitelistDomains = JSON.parse(guild.whitelistDomains),
      links = message.content.match(/(http[s]?:\/\/)(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&/=]*)/gi);

    // If there are no links in the message content, return
    if (!links) return;
    // If some domains are whitelisted, remove them from `links`
    if (whitelistDomains.length) {
      let matches = [];
      for (let i = 0; i < whitelistDomains.length; i++) {
        matches[i] = links.filter(url => !message.client.functions.isSameDomain(whitelistDomains[i], url));
      }
      links = message.client.functions.intersect(...matches);
    }
    // If there are no `links` left, return
    if (!links.length) return;

    // If the code reaches here, the message contains links that needs to be filtered
    filtered = true;
    // Delete the message
    if (message.deletable) {
      message.delete().catch(() => {});
    }

    message.channel.send({
      embed: {
        color: message.client.colors.ORANGE,
        description: `${message.author} you are not allowed to post links here.`
      }
    }).then(msg => {
      msg.delete(5000).catch(() => {});
    }).catch(e => {
      message.client.log.error(e);
    });

    // Log the links that are filtered
    let guildSettings = await message.guild.client.db.get(`SELECT modLog FROM guildSettings WHERE guildID=${message.guild.id}`);
    if (!guildSettings || !guildSettings.modLog) return filtered;

    let modLogChannel = message.guild.channels.get(guildSettings.modLog);
    if (!modLogChannel) return filtered;

    modLogChannel.send({
      embed: {
        color: message.client.colors.ORANGE,
        title: 'Filtered Links',
        fields: [
          {
            name: 'User',
            value: message.author.tag,
            inline: true
          },
          {
            name: 'User ID',
            value: message.author.id,
            inline: true
          },
          {
            name: 'Links',
            value: links.join('\n')
          }
        ],
        timestamp: new Date()
      }
    }).catch(e => {
      guild.client.log.error(e);
    });
    return filtered;
  }
  catch (e) {
    message.client.log.error(e);
  }
};
