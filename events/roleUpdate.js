/**
 * @file roleUpdate event
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

module.exports = async (oldRole, newRole) => {
  if (oldRole.name === newRole.name) return;

  try {
    let guildSettings = await newRole.client.db.get(`SELECT log FROM guildSettings WHERE guildID=${newRole.guild.id}`);
    if (!guildSettings || !guildSettings.log) return;

    let logChannel = newRole.guild.channels.get(guildSettings.log);
    if (!logChannel) return;

    logChannel.send({
      embed: {
        color: newRole.client.colors.ORANGE,
        title: newRole.guild.client.strings.events(newRole.guild.language, 'roleUpdate'),
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
