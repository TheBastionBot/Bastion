/**
 * @file guildUpdate event
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

module.exports = async (oldGuild, newGuild) => {
  if (oldGuild.name === newGuild.name) return;

  try {
    let guildSettings = await newGuild.client.db.get(`SELECT log FROM guildSettings WHERE guildID=${newGuild.id}`);
    if (!guildSettings || !guildSettings.log) return;

    let logChannel = newGuild.channels.get(guildSettings.log);
    if (!logChannel) return;

    logChannel.send({
      embed: {
        color: newGuild.client.colors.ORANGE,
        title: newGuild.client.strings.events(newGuild.language, 'guildUpdate'),
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
