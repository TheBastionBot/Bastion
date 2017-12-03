/**
 * @file flipText command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const flipText = require('../../data/flipText.json');

exports.exec = (Bastion, message, args) => {
  if (args.length < 1) {
    /**
     * The command was ran with invalid parameters.
     * @fires commandUsage
     */
    return Bastion.emit('commandUsage', message, this.help);
  }

  args = args.join(' ');
  for (let i = 0; i < Object.keys(flipText).length; i++) {
    args = args.replace(Object.keys(flipText)[i], flipText[Object.keys(flipText)[i]]);
  }

  message.channel.send({
    embed: {
      color: Bastion.colors.BLUE,
      title: 'Flipped Text:',
      description: args.split('').reverse().join('')
    }
  }).catch(e => {
    Bastion.log.error(e);
  });
};

exports.config = {
  aliases: [],
  enabled: true
};

exports.help = {
  name: 'flipText',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'fliptext <text>',
  example: [ 'fliptext This is Upside Down!' ]
};
