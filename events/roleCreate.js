/**
 * @file roleCreate event
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

module.exports = async role => {
  try {
    let guildSettings = await role.client.db.get(`SELECT log FROM guildSettings WHERE guildID=${role.guild.id}`);
    if (!guildSettings || !guildSettings.log) return;

    let logChannel = role.guild.channels.get(guildSettings.log);
    if (!logChannel) return;

    logChannel.send({
      embed: {
        color: role.client.colors.GREEN,
        title: role.guild.client.strings.events(role.guild.language, 'roleCreate'),
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
