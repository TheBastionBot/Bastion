/**
 * @file wouldYouRather command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

const question = require('../../assets/wouldYouRather.json');

exports.exec = (Bastion, message) => {
  message.channel.send({
    embed: {
      color: Bastion.colors.BLUE,
      description: question[Math.floor(Math.random() * question.length)]
    }
  }).catch(e => {
    Bastion.log.error(e);
  });
};

exports.config = {
  aliases: [ 'wouldyou' ],
  enabled: true
};

exports.help = {
  name: 'wouldYouRather',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'wouldYouRather',
  example: []
};
