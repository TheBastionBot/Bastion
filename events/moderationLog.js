/**
 * @file moderationLog event
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

/**
 * @param {Message} message The message that fired this moderation action
 * @param {string} action The moderation action's name
 * @param {User|Channel} target The target on which this action was taken
 * @param {string} reason The reason for the moderation action
 * @param {object} extras An object containing any extra data of the moderation action
 * @returns {void}
 */
module.exports = async (message, action, target, reason, extras) => {
  try {
    let guild = message.guild;
    let executor = message.author;

    let guildModel = await message.client.database.models.guild.findOne({
      attributes: [ 'moderationLog', 'moderationCaseNo' ],
      where: {
        guildID: guild.id
      }
    });

    if (!guildModel || !guildModel.dataValues.moderationLog) return;

    let modLogChannel = guild.channels.get(guildModel.dataValues.moderationLog);
    if (!modLogChannel) return;

    let modCaseNo = parseInt(guildModel.dataValues.moderationCaseNo), color,
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
        action = message.client.i18n.event(guild.language, 'addRole');
        color = message.client.colors.GREEN;
        logData.unshift(
          {
            name: 'Role',
            value: extras.role.name
          }
        );
        break;

      case 'ban':
        action = message.client.i18n.event(guild.language, 'guildBanAdd');
        color = message.client.colors.RED;
        break;

      case 'clear':
        action = message.client.i18n.event(guild.language, 'messageClear');
        color = message.client.colors.RED;
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
        action = message.client.i18n.event(guild.language, 'deafAdd');
        color = message.client.colors.ORANGE;
        break;

      case 'kick':
        action = message.client.i18n.event(guild.language, 'kick');
        color = message.client.colors.RED;
        break;

      case 'mute':
        action = message.client.i18n.event(guild.language, 'voiceMuteAdd');
        color = message.client.colors.ORANGE;
        break;

      /*
      case 'nickname':
        action = 'Updated User Nickname';
        color = message.client.colors.ORANGE;
        logData.push();
        break;
      */

      case 'removeallroles':
        action = message.client.i18n.event(guild.language, 'removeAllRole');
        color = message.client.colors.RED;
        break;

      case 'removerole':
        action = message.client.i18n.event(guild.language, 'removeRole');
        color = message.client.colors.RED;
        logData.unshift(
          {
            name: 'Role',
            value: extras.role.name
          }
        );
        break;

      case 'softban':
        action = message.client.i18n.event(guild.language, 'userSoftBan');
        color = message.client.colors.RED;
        break;

      case 'textmute':
        action = message.client.i18n.event(guild.language, 'textMuteAdd');
        color = message.client.colors.ORANGE;
        logData.splice(logData.length - 2, 0,
          {
            name: 'Channel',
            value: `${extras.channel}`
          }
        );
        break;

      case 'textunmute':
        action = message.client.i18n.event(guild.language, 'textMuteRemove');
        color = message.client.colors.GREEN;
        logData.splice(logData.length - 2, 0,
          {
            name: 'Channel',
            value: `${extras.channel}`
          }
        );
        break;

      case 'unban':
        action = message.client.i18n.event(guild.language, 'guildBanRemove');
        color = message.client.colors.GREEN;
        break;

      case 'undeafen':
        action = message.client.i18n.event(guild.language, 'deafRemove');
        color = message.client.colors.GREEN;
        break;

      case 'unmute':
        action = message.client.i18n.event(guild.language, 'voiceMuteRemove');
        color = message.client.colors.GREEN;
        break;

      case 'warn':
        action = message.client.i18n.event(guild.language, 'userWarnAdd');
        color = message.client.colors.ORANGE;
        break;

      case 'clearwarn':
        action = message.client.i18n.event(guild.language, 'userWarnRemove');
        color = message.client.colors.GREEN;
        break;

      default:
        return message.client.log.error(`Moderation logging is not present for ${action} action.`);
    }

    let modLogMessage = await modLogChannel.send({
      embed: {
        color: color,
        title: action,
        fields: logData,
        footer: {
          text: `Case Number: ${modCaseNo}`
        },
        timestamp: new Date()
      }
    });

    await message.client.database.models.moderationCase.create({
      guildID: guild.id,
      number: modCaseNo,
      messageID: modLogMessage.id
    },
    {
      fields: [ 'guildID', 'number', 'messageID' ]
    });

    await message.client.database.models.guild.update({
      moderationCaseNo: modCaseNo + 1
    },
    {
      where: {
        guildID: guild.id
      },
      fields: [ 'moderationCaseNo' ]
    });
  }
  catch (e) {
    message.client.log.error(e);
  }
};
