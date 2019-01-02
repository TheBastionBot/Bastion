/**
 * @file guildUpdate event
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

module.exports = async (oldGuild, newGuild) => {
  try {
    if (oldGuild.name === newGuild.name) return;

    let guildModel = await newGuild.client.database.models.guild.findOne({
      attributes: [ 'serverLog' ],
      where: {
        guildID: newGuild.id
      }
    });

    if (!guildModel || !guildModel.dataValues.serverLog) return;

    let logChannel = newGuild.channels.get(guildModel.dataValues.serverLog);
    if (!logChannel) return;

    logChannel.send({
      embed: {
        color: newGuild.client.colors.ORANGE,
        title: newGuild.client.i18n.event(newGuild.language, 'guildUpdate'),
        fields: [
          {
            name: 'New Server Name',
            value: newGuild.name,
            inline: true
          },
          {
            name: 'Old Server Name',
            value: oldGuild.name,
            inline: true
          },
          {
            name: 'Server ID',
            value: newGuild.id,
            inline: true
          }
        ],
        timestamp: new Date()
      }
    }).catch(e => {
      newGuild.client.log.error(e);
    });
  }
  catch (e) {
    newGuild.client.log.error(e);
  }
};
