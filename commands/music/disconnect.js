/**
 * @file disconnect command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

exports.exec = (Bastion, message) => {
  try {
    if (message.guild.music) {
      message.guild.music.songs = [];

      if (message.guild.music.dispatcher) {
        message.guild.music.dispatcher.end();
      }
    }

    if (message.guild.voiceConnection) {
      message.guild.voiceConnection.disconnect();
    }

    message.channel.send({
      embed: {
        color: Bastion.colors.RED,
        description: 'Disconnected from the voice connection of this server.'
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
  musicMasterOnly: true
};

exports.help = {
  name: 'disconnect',
  description: 'Disconnect Bastion from any voice connection in the Discord server.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'disconnect',
  example: []
};
