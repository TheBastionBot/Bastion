/**
 * @file moderationLog event
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

/**
 * @param {Guild} guild The guild where this moderation action was fired
 * @param {User} executor The user who fired this moderation action
 * @param {string} action The moderation action's name
 * @param {User|Channel} target The target on which this action was taken
 * @param {string} reason The reason for the moderation action
 * @param {object} extras An object containing any extra data of the moderation action
 * @returns {void}
 */
module.exports = async (guild, executor, action, target, reason, extras) => {
  try {
    let guildSettings = await guild.client.db.get(`SELECT modLog, modCaseNo FROM guildSettings WHERE guildID=${guild.id}`);
    if (!guildSettings || !guildSettings.modLog) return;

    let modLogChannel = guild.channels.get(guildSettings.modLog);
    if (!modLogChannel) return;

    let modCaseNo = parseInt(guildSettings.modCaseNo), color,
      logData = [
        {
          name: 'User',
          value: `${target}`,
          inline: true
        },
        {
          name: 'User ID',
          value: target.id,
          inline: true
        },
        {
          name: 'Reason',
          value: reason || 'No reason given'
        },
        {
          name: 'Responsible Moderator',
          value: `${executor}`,
          inline: true
        },
        {
          name: 'Moderator ID',
          value: executor.id,
          inline: true
        }
      ];

    switch (action.toLowerCase()) {
      case 'addrole':
        action = guild.client.strings.events(guild.language, 'addRole');
        color = guild.client.colors.GREEN;
        logData.unshift(
          {
            name: 'Role',
            value: extras.role.name
          }
        );
        break;

      case 'ban':
        action = guild.client.strings.events(guild.language, 'guildBanAdd');
        color = guild.client.colors.RED;
        break;

      case 'clear':
        action = guild.client.strings.events(guild.language, 'messageClear');
        color = guild.client.colors.RED;
        logData.splice(0, 3,
          {
            name: 'Channel',
            value: `${target}`,
            inline: true
          },
          {
            name: 'Channel ID',
            value: target.id,
            inline: true
          },
          {
            name: 'Cleared',
            value: extras.cleared
          }
        );
        break;

      case 'deafen':
        action = guild.client.strings.events(guild.language, 'deafAdd');
        color = guild.client.colors.ORANGE;
        break;

      case 'kick':
        action = guild.client.strings.events(guild.language, 'kick');
        color = guild.client.colors.RED;
        break;

      case 'mute':
        action = guild.client.strings.events(guild.language, 'voiceMuteAdd');
        color = guild.client.colors.ORANGE;
        break;

      /*
      case 'nickname':
        action = 'Updated User Nickname';
        color = guild.client.colors.ORANGE;
        logData.push();
        break;
      */

      case 'removeallroles':
        action = guild.client.strings.events(guild.language, 'removeAllRole');
        color = guild.client.colors.RED;
        break;

      case 'removerole':
        action = guild.client.strings.events(guild.language, 'removeRole');
        color = guild.client.colors.RED;
        logData.unshift(
          {
            name: 'Role',
            value: extras.role.name
          }
        );
        break;

      case 'report':
        action = guild.client.strings.events(guild.language, 'userReport');
        color = guild.client.colors.ORANGE;
        logData.splice(logData.length - 2, 2,
          {
            name: 'Reporter',
            value: `${executor}`,
            inline: true
          },
          {
            name: 'Reporter ID',
            value: executor.id,
            inline: true
          }
        );
        break;

      case 'softban':
        action = guild.client.strings.events(guild.language, 'userSoftBan');
        color = guild.client.colors.RED;
        break;

      case 'textmute':
        action = guild.client.strings.events(guild.language, 'textMuteAdd');
        color = guild.client.colors.ORANGE;
        logData.splice(logData.length - 2, 0,
          {
            name: 'Channel',
            value: `${extras.channel}`
          }
        );
        break;

      case 'textunmute':
        action = guild.client.strings.events(guild.language, 'textMuteRemove');
        color = guild.client.colors.GREEN;
        logData.splice(logData.length - 2, 0,
          {
            name: 'Channel',
            value: `${extras.channel}`
          }
        );
        break;

      case 'unban':
        action = guild.client.strings.events(guild.language, 'guildBanRemove');
        color = guild.client.colors.GREEN;
        break;

      case 'undeafen':
        action = guild.client.strings.events(guild.language, 'deafRemove');
        color = guild.client.colors.GREEN;
        break;

      case 'unmute':
        action = guild.client.strings.events(guild.language, 'voiceMuteRemove');
        color = guild.client.colors.GREEN;
        break;

      case 'warn':
        action = guild.client.strings.events(guild.language, 'userWarnAdd');
        color = guild.client.colors.ORANGE;
        break;

      case 'clearwarn':
        action = guild.client.strings.events(guild.language, 'userWarnRemove');
        color = guild.client.colors.GREEN;
        break;

      default:
        return guild.client.log.error(`Moderation logging is not present for ${action} action.`);
    }

    modLogChannel.send({
      embed: {
        color: color,
        title: action,
        fields: logData,
        footer: {
          text: `Case Number: ${modCaseNo}`
        },
        timestamp: new Date()
      }
    }).catch(e => {
      guild.client.log.error(e);
    });

    await guild.client.db.run(`UPDATE guildSettings SET modCaseNo='${modCaseNo + 1}' WHERE guildID=${guild.id}`);
  }
  catch (e) {
    guild.client.log.error(e);
  }
};
