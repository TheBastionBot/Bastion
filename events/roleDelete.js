/**
 * @file roleDelete event
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

module.exports = role => {
  role.client.db.get(`SELECT log, logChannelID FROM guildSettings WHERE guildID=${role.guild.id}`).then(row => {
    if (!row) return;
    if (row.log === 'false') return;

    role.guild.channels.get(row.logChannelID).send({
      embed: {
        color: role.client.colors.red,
        title: 'Role Deleted',
        fields: [
          {
            name: 'Role Name',
            value: role.name,
            inline: true
          },
          {
            name: 'Role ID',
            value: role.id,
            inline: true
          },
          {
            name: 'External',
            value: role.managed,
            inline: true
          }
        ],
        timestamp: new Date()
      }
    }).catch(e => {
      role.client.log.error(e.stack);
    });
  }).catch(e => {
    role.client.log.error(e.stack);
  });
};
