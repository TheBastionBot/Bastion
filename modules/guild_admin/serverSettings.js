/**
 * @file serverSettings command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.exec = async (Bastion, message) => {
  try {
    let guildSettings = await Bastion.db.get(`SELECT * FROM guildSettings WHERE guildID=${message.guild.id}`);

    message.channel.send({
      embed: {
        color: Bastion.colors.BLUE,
        title: message.guild.name,
        description: 'Server settings status',
        fields: [
          {
            name: 'Greetings',
            value: guildSettings.greet ? `<#${guildSettings.greet}>` : 'Disabled',
            inline: true
          },
          {
            name: 'Farewell',
            value: guildSettings.farewell ? `<#${guildSettings.farewell}>` : 'Disabled',
            inline: true
          },
          {
            name: 'Announcements',
            value: guildSettings.announcementChannel ? `<#${guildSettings.announcementChannel}>` : 'Disabled',
            inline: true
          },
          {
            name: 'Server Log',
            value: guildSettings.log ? `<#${guildSettings.log}>` : 'Disabled',
            inline: true
          },
          {
            name: 'Moderation Log',
            value: guildSettings.modLog ? `<#${guildSettings.modLog}>` : 'Disabled',
            inline: true
          },
          {
            name: 'Warn Action',
            value: guildSettings.warnAction ? guildSettings.warnAction : 'None',
            inline: true
          },
          {
            name: 'Level Up Message',
            value: guildSettings.levelUpMessage ? 'Enabled' : 'Disabled',
            inline: true
          },
          {
            name: 'Starboard',
            value: guildSettings.starboard ? `<#${guildSettings.starboard}>` : 'Disabled',
            inline: true
          },
          {
            name: 'Slow Mode',
            value: guildSettings.slowMode ? 'Enabled' : 'Disabled',
            inline: true
          },
          {
            name: 'Invite Filter',
            value: guildSettings.filterInvite ? 'Enabled' : 'Disabled',
            inline: true
          },
          {
            name: 'Link Filter',
            value: guildSettings.filterLink ? 'Enabled' : 'Disabled',
            inline: true
          },
          {
            name: 'Word Filter',
            value: guildSettings.filterWord ? 'Enabled' : 'Disabled',
            inline: true
          }
        ],
        footer: {
          text: `Prefix: ${guildSettings.prefix} • Language: ${guildSettings.language.toUpperCase()}`
        }
      }
    }).catch(e => {
      Bastion.log.error(e);
    });
  }
  catch (e) {
    Bastion.log.error(e);
  }
};

exports.config = {
  aliases: [],
  enabled: true
};

exports.help = {
  name: 'serverSettings',
  botPermission: '',
  userTextPermission: 'MANAGE_GUILD',
  userVoicePermission: '',
  usage: 'serverSettings',
  example: []
};
