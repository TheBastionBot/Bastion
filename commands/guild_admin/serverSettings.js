/**
 * @file serverSettings command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

exports.exec = async (Bastion, message) => {
  try {
    let guildModel = await Bastion.database.models.guild.findOne({
      where: {
        guildID: message.guild.id
      }
    });

    message.channel.send({
      embed: {
        color: Bastion.colors.BLUE,
        title: message.guild.name,
        description: 'A brief overview of the server settings.',
        fields: [
          {
            name: 'Greetings',
            value: guildModel.dataValues.greet ? `<#${guildModel.dataValues.greet}>` : 'Disabled',
            inline: true
          },
          {
            name: 'Farewell',
            value: guildModel.dataValues.farewell ? `<#${guildModel.dataValues.farewell}>` : 'Disabled',
            inline: true
          },
          {
            name: 'Bastion Announcements',
            value: guildModel.dataValues.announcementChannel ? `<#${guildModel.dataValues.announcementChannel}>` : 'Disabled',
            inline: true
          },
          {
            name: 'Server Log',
            value: guildModel.dataValues.serverLog ? `<#${guildModel.dataValues.serverLog}>` : 'Disabled',
            inline: true
          },
          {
            name: 'Moderation Log',
            value: guildModel.dataValues.moderationLog ? `<#${guildModel.dataValues.moderationLog}>` : 'Disabled',
            inline: true
          },
          {
            name: 'Level Up Messages',
            value: guildModel.dataValues.levelUpMessages ? 'Enabled' : 'Disabled',
            inline: true
          },
          {
            name: 'Starboard',
            value: guildModel.dataValues.starboard ? `<#${guildModel.dataValues.starboard}>` : 'Disabled',
            inline: true
          },
          {
            name: 'Slow Mode',
            value: guildModel.dataValues.slowMode ? 'Enabled' : 'Disabled',
            inline: true
          },
          {
            name: 'Bastion Chat',
            value: guildModel.dataValues.chat ? 'Enabled' : 'Disabled',
            inline: true
          },
          {
            name: 'Warn Action',
            value: guildModel.dataValues.warnAction ? guildModel.dataValues.warnAction : 'None',
            inline: true
          },
          {
            name: 'Invite Filter',
            value: guildModel.dataValues.filterInvites ? 'Enabled' : 'Disabled',
            inline: true
          },
          {
            name: 'Link Filter',
            value: guildModel.dataValues.filterLinks ? 'Enabled' : 'Disabled',
            inline: true
          },
          {
            name: 'Word Filter',
            value: guildModel.dataValues.filterWords ? 'Enabled' : 'Disabled',
            inline: true
          },
          {
            name: 'Mention Filter',
            value: guildModel.dataValues.filterMentions ? 'Enabled' : 'Disabled',
            inline: true
          },
          {
            name: 'Suggestion Channel',
            value: guildModel.dataValues.suggestionChannel ? `<#${guildModel.dataValues.suggestionChannel}>` : 'Disabled',
            inline: true
          }
        ],
        footer: {
          text: `Prefix: ${guildModel.dataValues.prefix.join(' ')} • Language: ${guildModel.dataValues.language.toUpperCase()}`
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
  description: 'Shows the status of your server\'s configured settings.',
  botPermission: '',
  userTextPermission: 'MANAGE_GUILD',
  userVoicePermission: '',
  usage: 'serverSettings',
  example: []
};
