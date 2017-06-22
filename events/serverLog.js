/**
 * @file serverLog event
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

/**
 * @param {object} Bastion The Bastion Discord client object
 * @param {object} guild The Discord guild object where the serverLog event was fired
 * @param {string} event The event's name
 * @param {object} parameters An object containing the parameters of the event
 * @returns {void}
 */
module.exports = (Bastion, guild, event, parameters) => {
  if (!Bastion.ping) {
    throw 'Invalid Bastion Discord client object';
  }
  if (typeof event !== 'string') {
    throw 'Event name should be a string';
  }
  if (guild.hasOwnProperty('available')) {
    throw 'Invalid Discord guild object';
  }

  Bastion.db.get(`SELECT log, logChannelID FROM guildSettings WHERE guildID=${guild.id}`).
    then(guildSettings => {
      if (!guildSettings) return;

      let log = (guildSettings.log === 'true');
      if (!log) return;

      let logChannelID = guildSettings.logChannelID,
        logChannel = guild.channels.get(logChannelID);

      if (!logChannel) return;

      let color, logData = [];

      switch (event) {
        case 'channelCreate':
          event = `${parameters.channel.type.charAt(0).toUpperCase()}${parameters.channel.type.substr(1)} Channel Created`;
          color = Bastion.colors.green;
          logData.push(
            {
              name: 'Channel Name',
              value: parameters.channel.name,
              inline: true
            },
            {
              name: 'Channel ID',
              value: parameters.channel.id,
              inline: true
            }
          );
          break;

        case 'channelDelete':
          event = `${parameters.channel.type.charAt(0).toUpperCase()}${parameters.channel.type.substr(1)} Channel Deleted`;
          color = Bastion.colors.red;
          logData.push(
            {
              name: 'Channel Name',
              value: parameters.channel.name,
              inline: true
            },
            {
              name: 'Channel ID',
              value: parameters.channel.id,
              inline: true
            }
          );
          break;

        case 'channelUpdate':
          event = `${parameters.newChannel.type.charAt(0).toUpperCase()}${parameters.newChannel.type.substr(1)} Channel Renamed`;
          color = Bastion.colors.orange;
          logData.push(
            {
              name: 'Old Channel Name',
              value: parameters.oldChannel.name,
              inline: true
            },
            {
              name: 'New Channel Name',
              value: parameters.newChannel.name,
              inline: true
            },
            {
              name: 'Channel ID',
              value: parameters.newChannel.id,
              inline: true
            }
          );
          break;

        case 'guildBanAdd':
          event = 'User Banned';
          color = Bastion.colors.red;
          logData.push(
            {
              name: 'User',
              value: parameters.user.tag,
              inline: true
            },
            {
              name: 'User ID',
              value: parameters.user.id,
              inline: true
            }
          );
          break;

        case 'guildBanRemove':
          event = 'User Unbanned';
          color = Bastion.colors.green;
          logData.push(
            {
              name: 'User',
              value: parameters.user.tag,
              inline: true
            },
            {
              name: 'User ID',
              value: parameters.user.id,
              inline: true
            }
          );
          break;

        case 'guildMemberAdd':
          event = 'User Joined';
          color = Bastion.colors.green;
          logData.push(
            {
              name: 'User',
              value: parameters.member.user.tag,
              inline: true
            },
            {
              name: 'User ID',
              value: parameters.member.id,
              inline: true
            }
          );
          break;

        case 'guildMemberRemove':
          event = 'User Left';
          color = Bastion.colors.red;
          logData.push(
            {
              name: 'User',
              value: parameters.member.user.tag,
              inline: true
            },
            {
              name: 'User ID',
              value: parameters.member.id,
              inline: true
            }
          );
          break;

        case 'guildUpdate':
          event = 'Server Renamed';
          color = Bastion.colors.orange;
          logData.push(
            {
              name: 'Old Server Name',
              value: parameters.oldGuild.name,
              inline: true
            },
            {
              name: 'New Server Name',
              value: parameters.newGuild.name,
              inline: true
            },
            {
              name: 'Server ID',
              value: parameters.newGuild.id,
              inline: true
            }
          );
          break;

        case 'roleCreate':
          event = 'Role Created';
          color = Bastion.colors.green;
          logData.push(
            {
              name: 'Role Name',
              value: parameters.role.name,
              inline: true
            },
            {
              name: 'Role ID',
              value: parameters.role.id,
              inline: true
            },
            {
              name: 'External Role',
              value: parameters.role.managed,
              inline: true
            }
          );
          break;

        case 'roleDelete':
          event = 'Role Deleted';
          color = Bastion.colors.red;
          logData.push(
            {
              name: 'Role Name',
              value: parameters.role.name,
              inline: true
            },
            {
              name: 'Role ID',
              value: parameters.role.id,
              inline: true
            },
            {
              name: 'External Role',
              value: parameters.role.managed,
              inline: true
            }
          );
          break;

        case 'roleUpdate':
          event = 'Role Updated';
          color = Bastion.colors.orange;
          logData.push(
            {
              name: 'Old Role Name',
              value: parameters.oldRole.name,
              inline: true
            },
            {
              name: 'New Role Name',
              value: parameters.newRole.name,
              inline: true
            },
            {
              name: 'Role ID',
              value: parameters.newRole.id,
              inline: true
            }
          );
          break;

        default:
          return Bastion.log.error(`Server logging is not present for ${event} event.`);
      }

      logChannel.send({
        embed: {
          color: color,
          title: event,
          fields: logData,
          timestamp: new Date()
        }
      }).catch(e => {
        Bastion.log.error(e.stack);
      });
    }).catch(e => {
      Bastion.log.error(e);
    });
};
