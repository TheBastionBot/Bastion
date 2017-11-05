/**
 * @file guildBanRemove event
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

module.exports = async (guild, user) => {
  try {
    let guildSettings = await guild.client.db.get(`SELECT log FROM guildSettings WHERE guildID=${guild.id}`);
    if (!guildSettings || !guildSettings.log) return;

    let logChannel = guild.channels.get(guildSettings.log);
    if (!logChannel) return;

    logChannel.send({
      embed: {
        color: guild.client.colors.GREEN,
        title: guild.client.strings.events(guild.language, 'guildBanRemove'),
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
