/**
 * @file messageUpdate event
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

const credentialsFilter = xrequire('./filters/credentialsFilter');
const wordFilter = xrequire('./filters/wordFilter');
const linkFilter = xrequire('./filters/linkFilter');
const inviteFilter = xrequire('./filters/inviteFilter');

module.exports = async  (oldMessage, newMessage) => {
  try {
    // If message content hasn't been changed, do nothing
    if (oldMessage.content === newMessage.content) return;

    // Filter Bastion's credentials from the message
    credentialsFilter(newMessage);

    if (!oldMessage.guild) return;
    if (newMessage.author.bot) return;

    // Filter specific words from the message
    wordFilter(newMessage);

    // Filter links from the message
    linkFilter(newMessage);

    // Filter Discord server invites from the message
    inviteFilter(newMessage);

    // Server Logging
    let guildModel = await newMessage.client.database.models.guild.findOne({
      attributes: [ 'serverLog' ],
      where: {
        guildID: newMessage.guild.id
      }
    });

    if (!guildModel || !guildModel.dataValues.serverLog) return;

    let logChannel = newMessage.guild.channels.get(guildModel.dataValues.serverLog);
    if (!logChannel) return;

    logChannel.send({
      embed: {
        color: newMessage.client.colors.ORANGE,
        title: newMessage.client.i18n.event(newMessage.guild.language, 'messageUpdate'),
        fields: [
          {
            name: 'Message Channel',
            value: newMessage.channel.toString(),
            inline: true
          },
          {
            name: 'Message Channel ID',
            value: newMessage.channel.id,
            inline: true
          },
          {
            name: 'Message ID',
            value: newMessage.id,
            inline: true
          },
          {
            name: 'Message Author',
            value: newMessage.author.tag,
            inline: true
          },
          {
            name: 'Message Author ID',
            value: newMessage.author.id,
            inline: true
          },
          {
            name: 'Old Message Content',
            value: '~~Deleted~~',
            inline: true
          }
        ],
        timestamp: new Date()
      }
    }).catch(e => {
      newMessage.client.log.error(e);
    });
  }
  catch (e) {
    newMessage.client.log.error(e);
  }
};
