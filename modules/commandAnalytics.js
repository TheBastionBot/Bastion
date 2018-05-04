/**
 * @file commandAnalytics command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.exec = (Bastion, message) => {
  let mostUsedCommands = Object.keys(message.guild.commandAnalytics);
  mostUsedCommands = mostUsedCommands.slice(0, 10);
  mostUsedCommands = mostUsedCommands.map(command => `\`${command}\` - ${message.guild.commandAnalytics[command]} times`);

  message.channel.send({
    embed: {
      color: Bastion.colors.BLUE,
      title: 'Most used commands in this Server',
      description: mostUsedCommands.join('\n'),
      footer: {
        text: 'Command stats are cleared after restart.'
      }
    }
  }).catch(e => {
    Bastion.log.error(e);
  });
};

exports.config = {
  aliases: [ 'commandStats' ],
  enabled: true
};

exports.help = {
  name: 'commandAnalytics',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'commandAnalytics',
  example: []
};
