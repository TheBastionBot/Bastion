/**
 * @file guildDelete event
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

module.exports = guild => {
  guild.client.database.models.guild.destroy({
    where: {
      guildID: guild.id
    }
  }).catch(e => {
    guild.client.log.error(e);
  });

  guild.client.webhook.send('bastionLog', {
    color: guild.client.colors.RED,
    title: guild.client.i18n.event(guild.language, 'guildDelete'),
    fields: [
      {
        name: 'Server Name',
        value: guild.name,
        inline: true
      },
      {
        name: 'Server ID',
        value: guild.id,
        inline: true
      },
      {
        name: 'Server Owner',
        value: guild.owner ? guild.owner.user.tag : 'Unknown',
        inline: true
      },
      {
        name: 'Server Owner ID',
        value: guild.ownerID,
        inline: true
      }
    ],
    thumbnail: {
      url: guild.icon ? guild.iconURL : `https://dummyimage.com/128/7289DA/FFFFFF/&text=${encodeURIComponent(guild.nameAcronym)}`
    },
    timestamp: new Date()
  });
};
