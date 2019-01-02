/**
 * @file roleUpdate event
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

module.exports = async (oldRole, newRole) => {
  try {
    if (oldRole.name === newRole.name) return;

    let guildModel = await newRole.client.database.models.guild.findOne({
      attributes: [ 'serverLog' ],
      where: {
        guildID: newRole.guild.id
      }
    });

    if (!guildModel || !guildModel.dataValues.serverLog) return;

    let logChannel = newRole.guild.channels.get(guildModel.dataValues.serverLog);
    if (!logChannel) return;

    logChannel.send({
      embed: {
        color: newRole.client.colors.ORANGE,
        title: newRole.guild.client.i18n.event(newRole.guild.language, 'roleUpdate'),
        fields: [
          {
            name: 'New Role Name',
            value: newRole.name || '`None`',
            inline: true
          },
          {
            name: 'Old Role Name',
            value: oldRole.name || '`None`',
            inline: true
          },
          {
            name: 'Role ID',
            value: newRole.id,
            inline: true
          }
        ],
        timestamp: new Date()
      }
    }).catch(e => {
      newRole.client.log.error(e);
    });
  }
  catch (e) {
    newRole.client.log.error(e);
  }
};
