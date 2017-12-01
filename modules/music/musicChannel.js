/**
 * @file musicChannel command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.exec = async (Bastion, message, args) => {
  try {
    if (!(parseInt(args[0]) < 9223372036854775807)) {
      await Bastion.db.run(`UPDATE guildSettings SET musicTextChannel=null, musicVoiceChannel=null WHERE guildID=${message.guild.id}`);

      return message.channel.send({
        embed: {
          color: Bastion.colors.RED,
          description: 'Default music channel removed.'
        }
      }).catch(e => {
        Bastion.log.error(e);
      });
    }

    await Bastion.db.run(`UPDATE guildSettings SET musicTextChannel=${message.channel.id}, musicVoiceChannel=${args[0]} WHERE guildID=${message.guild.id}`);

    message.channel.send({
      embed: {
        color: Bastion.colors.GREEN,
        title: 'Default music channel set',
        fields: [
          {
            name: 'Text channel for music commands',
            value: `<#${message.channel.id}>`
          },
          {
            name: 'Music channel',
            value: message.guild.channels.filter(c => c.type === 'voice').get(args[0]) ? message.guild.channels.filter(c => c.type === 'voice').get(args[0]).name : 'Invalid'
          }
        ]
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
  enabled: true,
  ownerOnly: true
};

exports.help = {
  name: 'musicChannel',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'musicChannel [VOICE_CHANNEL_ID]',
  example: [ 'musicChannel 308278968078041098', 'musicChannel' ]
};
