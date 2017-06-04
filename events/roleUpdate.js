/**
 * @file roleUpdate event
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

module.exports = (oldRole, newRole) => {
  if (oldRole.name === newRole.name) return;

  oldRole.client.db.get(`SELECT log, logChannelID FROM guildSettings WHERE guildID=${newRole.guild.id}`).then(row => {
    if (!row) return;
    if (row.log === 'false') return;

    newRole.guild.channels.get(row.logChannelID).send({
      embed: {
        color: newRole.client.colors.yellow,
        title: 'Role Name Changed',
        fields: [
          {
            name: 'Old Role Name',
            value: oldRole.name,
            inline: true
          },
          {
            name: 'New Role Name',
            value: newRole.name,
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
      newRole.client.log.error(e.stack);
    });
  }).catch(e => {
    newRole.client.log.error(e.stack);
  });
};
