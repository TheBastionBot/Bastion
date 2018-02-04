/**
 * @file messageReactionAdd event
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

let starredMessages = [];

module.exports = async (reaction, user) => {
  try {
    if (!reaction.message.guild) return;
    if (reaction.message.author.id === user.id) return;
    let guildSettings = await user.client.db.get(`SELECT starboard FROM guildSettings WHERE guildID=${reaction.message.guild.id}`);
    if (!guildSettings || !guildSettings.starboard) return;
    if (!reaction.message.content) return;
    if (starredMessages.includes(reaction.message.id)) return;

    let stars = [ '🌟', '⭐' ];
    if (!stars.includes(reaction.emoji.name)) return;

    let image;
    if (reaction.message.attachments.size) {
      if (reaction.message.attachments.first().height) {
        image = reaction.message.attachments.first().url;
      }
    }

    if (!image && !reaction.message.content) return;

    let starboardChannel = reaction.message.guild.channels.get(guildSettings.starboard);
    if (starboardChannel) {
      await starboardChannel.send({
        embed: {
          color: user.client.colors.GOLD,
          author: {
            name: reaction.message.author.tag,
            icon_url: reaction.message.author.displayAvatarURL
          },
          description: reaction.message.content,
          fields: [
            {
              name: 'Channel',
              value: reaction.message.channel.toString(),
              inline: true
            },
            {
              name: 'Message ID',
              value: reaction.message.id,
              inline: true
            }
          ],
          image: {
            url: image
          },
          timestamp: reaction.message.createdAt
        }
      });
    }
    starredMessages.push(reaction.message.id);
  }
  catch (e) {
    user.client.log.error(e);
  }
};
