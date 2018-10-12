/**
 * @file roleCreate event
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

module.exports = async role => {
  try {
    let guildModel = await role.client.database.models.guild.findOne({
      attributes: [ 'serverLog' ],
      where: {
        guildID: role.guild.id
      }
    });

    if (!guildModel || !guildModel.dataValues.serverLog) return;

    let logChannel = role.guild.channels.get(guildModel.dataValues.serverLog);
    if (!logChannel) return;

    logChannel.send({
      embed: {
        color: role.client.colors.GREEN,
        title: role.guild.client.i18n.event(role.guild.language, 'roleCreate'),
        fields: [
          {
            name: 'Role Name',
            value: role.name || '`None`',
            inline: true
          },
          {
            name: 'Role ID',
            value: role.id,
            inline: true
          },
          {
            name: 'External Role',
            value: role.managed,
            inline: true
          }
        ],
        timestamp: new Date()
      }
    }).catch(e => {
      role.client.log.error(e);
    });
  }
  catch (e) {
    role.client.log.error(e);
  }
};
