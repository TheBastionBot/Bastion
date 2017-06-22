/**
 * @file bastionLog event
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

/**
 * @param {object} Bastion The Bastion Discord client object
 * @param {string} event The event's name
 * @param {Guild} guild The guild object which triggered this event
 * @returns {void}
 */
module.exports = (Bastion, event, guild) => {
  Bastion.db.get('SELECT log, logChannelID FROM bastionSettings').
    then(bastionSettings => {
      if (!bastionSettings) return;

      let log = (bastionSettings.log === 'true');
      if (!log) return;

      let logChannelID = bastionSettings.logChannelID,
        logChannel = Bastion.channels.get(logChannelID);

      if (!logChannel) return;

      let color, guildIcon = guild.iconURL || 'https://discordapp.com/assets/2c21aeda16de354ba5334551a883b481.png',
        logData = [
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
            value: guild.owner.user.tag,
            inline: true
          },
          {
            name: 'Server Owner ID',
            value: guild.ownerID,
            inline: true
          }
        ];

      switch (event) {
        case 'guildCreate':
          event = 'Joined Server';
          color = Bastion.colors.green;
          break;

        case 'guildDelete':
          event = 'Left Server';
          color = Bastion.colors.red;
          break;

        default:
          return Bastion.log.error(`Bastion logging is not present for ${event} event.`);
      }

      logChannel.send({
        embed: {
          color: color,
          title: event,
          fields: logData,
          thumbnail: {
            url: guildIcon
          },
          timestamp: new Date()
        }
      }).catch(e => {
        Bastion.log.error(e);
      });
    }).catch(e => {
      Bastion.log.error(e);
    });
};
