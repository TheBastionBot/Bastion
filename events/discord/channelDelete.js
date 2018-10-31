/**
 * @file channelDelete event
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

module.exports = async channel => {
  try {
    if (!channel.guild) return;

    let guildModel = await channel.client.database.models.guild.findOne({
      attributes: [ 'serverLog' ],
      where: {
        guildID: channel.guild.id
      }
    });

    if (!guildModel || !guildModel.dataValues.serverLog) return;

    let logChannel = channel.guild.channels.get(guildModel.dataValues.serverLog);
    if (!logChannel) return;

    let title = channel.client.i18n.event(channel.guild.language, 'channelDelete');
    if (channel.type === 'text') {
      title = channel.client.i18n.event(channel.guild.language, 'textChannelDelete');
    }
    else if (channel.type === 'voice') {
      title = channel.client.i18n.event(channel.guild.language, 'voiceChannelDelete');
    }
    else if (channel.type === 'category') {
      title = channel.client.i18n.event(channel.guild.language, 'categoryChannelDelete');
    }

    logChannel.send({
      embed: {
        color: channel.client.colors.RED,
        title: title,
        fields: [
          {
            name: 'Channel Name',
            value: channel.name,
            inline: true
          },
          {
            name: 'Channel ID',
            value: channel.id,
            inline: true
          }
        ],
        timestamp: new Date()
      }
    }).catch(e => {
      channel.client.log.error(e);
    });
  }
  catch (e) {
    channel.client.log.error(e);
  }
};
