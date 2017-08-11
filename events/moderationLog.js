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
  let guildSettings = await guild.client.db.get(`SELECT modLog, modCaseNo FROM guildSettings WHERE guildID=${guild.id}`).catch(e => {
    guild.client.log.error(e);
  });
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

  switch (action) {
    case 'addrole':
      action = 'Added Role';
      color = guild.client.colors.green;
      logData.unshift(
        {
          name: 'Role',
          value: extras.role.name
        }
      );
      break;

    case 'ban':
      action = 'Banned User';
      color = guild.client.colors.red;
      break;

    case 'clear':
      action = 'Cleared Messages';
      color = guild.client.colors.red;
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
      action = 'Deafened User';
      color = guild.client.colors.orange;
      break;

    case 'kick':
      action = 'Kicked User';
      color = guild.client.colors.red;
      break;

    case 'mute':
      action = 'Muted User';
      color = guild.client.colors.orange;
      break;

    /*
    case 'nickname':
      action = 'Updated User Nickname';
      color = guild.client.colors.orange;
      logData.push();
      break;
    */

    case 'removeallroles':
      action = 'Removed All Roles';
      color = guild.client.colors.red;
      break;

    case 'removerole':
      action = 'Removed Role';
      color = guild.client.colors.red;
      logData.unshift(
        {
          name: 'Role',
          value: extras.role.name
        }
      );
      break;

    case 'report':
      action = 'Reported User';
      color = guild.client.colors.orange;
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
      action = 'Soft Banned User';
      color = guild.client.colors.red;
      break;

    case 'textmute':
      action = 'Text Muted User';
      color = guild.client.colors.orange;
      logData.splice(logData.length - 2, 0,
        {
          name: 'Channel',
          value: `${extras.channel}`
        }
      );
      break;

    case 'textunmute':
      action = 'Text Unmuted User';
      color = guild.client.colors.green;
      logData.splice(logData.length - 2, 0,
        {
          name: 'Channel',
          value: `${extras.channel}`
        }
      );
      break;

    case 'undeafen':
      action = 'Undeafen User';
      color = guild.client.colors.green;
      break;

    case 'unmute':
      action = 'Unmuted User';
      color = guild.client.colors.green;
      break;

    case 'warn':
      action = 'Warned User';
      color = guild.client.colors.orange;
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

  guild.client.db.run(`UPDATE guildSettings SET modCaseNo='${modCaseNo + 1}' WHERE guildID=${guild.id}`).catch(e => {
    guild.client.log.error(e);
  });
};
