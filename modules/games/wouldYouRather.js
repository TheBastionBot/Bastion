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
      color: Bastion.colors.blue,
      description: question[Math.floor(Math.random() * question.length)]
      // description: question.random()
    }
  }).catch(e => {
    Bastion.log.error(e.stack);
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
