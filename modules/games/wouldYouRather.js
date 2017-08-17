/**
 * @file wouldYouRather command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const string = require('../../handlers/languageHandler');
const question = require('../../data/wouldYouRather.json');

exports.run = (Bastion, message) => {
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
  name: 'wouldyourather',
  description: string('wouldYouRather', 'commandDescription'),
  botPermission: '',
  userPermission: '',
  usage: 'wouldYouRather',
  example: []
};
