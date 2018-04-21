/**
 * @file channelUpdate event
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

module.exports = async (oldChannel, newChannel) => {
  try {
    if (!oldChannel.guild) return;
    if (oldChannel.name === newChannel.name) return;

    let guildModel = await newChannel.client.database.models.guild.findOne({
      attributes: [ 'serverLog' ],
      where: {
        guildID: newChannel.guild.id
      }
    });

    if (!guildModel || !guildModel.dataValues.serverLog) return;

    let logChannel = newChannel.guild.channels.get(guildModel.dataValues.serverLog);
    if (!logChannel) return;

    let title = newChannel.client.strings.events(newChannel.guild.language, 'channelUpdate');
    if (newChannel.type === 'text') {
      title = newChannel.client.strings.events(newChannel.guild.language, 'textChannelUpdate');
    }
    else if (newChannel.type === 'voice') {
      title = newChannel.client.strings.events(newChannel.guild.language, 'voiceChannelUpdate');
    }

    logChannel.send({
      embed: {
        color: newChannel.client.colors.ORANGE,
        title: title,
        fields: [
          {
            name: 'New Channel Name',
            value: newChannel.name,
            inline: true
          },
          {
            name: 'Old Channel Name',
            value: oldChannel.name,
            inline: true
          },
          {
            name: 'Channel ID',
            value: newChannel.id,
            inline: true
          }
        ],
        timestamp: new Date()
      }
    }).catch(e => {
      newChannel.client.log.error(e);
    });
  }
  catch (e) {
    newChannel.client.log.error(e);
  }
};
