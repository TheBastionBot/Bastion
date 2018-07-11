/**
 * @file messageDelete event
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

module.exports = async message => {
  try {
    let guildModel = await message.client.database.models.guild.findOne({
      attributes: [ 'serverLog' ],
      where: {
        guildID: message.guild.id
      }
    });

    if (!guildModel || !guildModel.dataValues.serverLog) return;

    let logChannel = message.guild.channels.get(guildModel.dataValues.serverLog);
    if (!logChannel) return;

    logChannel.send({
      embed: {
        color: message.client.colors.RED,
        title: message.client.i18n.event(message.guild.language, 'messageDelete'),
        fields: [
          {
            name: 'Message Channel',
            value: message.channel.toString(),
            inline: true
          },
          {
            name: 'Message Channel ID',
            value: message.channel.id,
            inline: true
          },
          {
            name: 'Message ID',
            value: message.id,
            inline: true
          },
          {
            name: 'Message Author',
            value: message.author.tag,
            inline: true
          },
          {
            name: 'Message Author ID',
            value: message.author.id,
            inline: true
          },
          {
            name: 'Message Content',
            value: '~~Deleted~~',
            inline: true
          }
        ],
        timestamp: new Date()
      }
    }).catch(e => {
      message.client.log.error(e);
    });
  }
  catch (e) {
    message.client.log.error(e);
  }
};
