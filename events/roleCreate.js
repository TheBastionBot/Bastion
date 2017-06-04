/**
 * @file roleCreate event
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

module.exports = role => {
  role.client.db.get(`SELECT log, logChannelID FROM guildSettings WHERE guildID=${role.guild.id}`).then(row => {
    if (!row) return;
    if (row.log === 'false') return;

    role.guild.channels.get(row.logChannelID).send({
      embed: {
        color: role.client.colors.green,
        title: 'Role Created',
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
            name: 'Role Color',
            value: role.hexColor,
            inline: true
          },
          {
            name: 'Hoisted',
            value: role.hoist,
            inline: true
          },
          {
            name: 'Mentionable',
            value: role.mentionable,
            inline: true
          },
          {
            name: 'External',
            value: role.managed,
            inline: true
          }
        ],
        timestamp: role.createdAt
      }
    }).catch(e => {
      role.client.log.error(e.stack);
    });
  }).catch(e => {
    role.client.log.error(e.stack);
  });
};
