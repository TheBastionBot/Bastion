/**
 * @file resetModerationLogs command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.exec = async (Bastion, message) => {
  try {
    await Bastion.database.models.guild.update({
      moderationCaseNo: 1
    },
    {
      where: {
        guildID: message.guild.id
      },
      fields: [ 'moderationCaseNo' ]
    });

    message.channel.send({
      embed: {
        color: Bastion.colors.GREEN,
        description: Bastion.strings.info(message.guild.language, 'resetModerationLogCases', message.author.tag)
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
  aliases: [ 'resetModLogs' ],
  enabled: true
};

exports.help = {
  name: 'resetModerationLogs',
  botPermission: '',
  userTextPermission: 'MANAGE_GUILD',
  userVoicePermission: '',
  usage: 'resetModerationLogs',
  example: []
};
