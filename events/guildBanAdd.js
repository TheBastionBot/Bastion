/**
 * @file guildBanAdd event
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

module.exports = async (guild, user) => {
  try {
    let guildModel = await guild.client.database.models.guild.findOne({
      attributes: [ 'serverLog' ],
      where: {
        guildID: guild.id
      }
    });

    if (!guildModel || !guildModel.dataValues.serverLog) return;

    let logChannel = guild.channels.get(guildModel.dataValues.serverLog);
    if (!logChannel) return;

    logChannel.send({
      embed: {
        color: guild.client.colors.RED,
        title: guild.client.i18n.event(guild.language, 'guildBanAdd'),
        fields: [
          {
            name: 'User',
            value: user.tag,
            inline: true
          },
          {
            name: 'User ID',
            value: user.id,
            inline: true
          }
        ],
        timestamp: new Date()
      }
    }).catch(e => {
      guild.client.log.error(e);
    });
  }
  catch (e) {
    guild.client.log.error(e);
  }
};
