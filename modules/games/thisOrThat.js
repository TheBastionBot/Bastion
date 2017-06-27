/**
 * @file thisOrThat command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const string = require('../../handlers/languageHandler');
const question = require('../../data/thisOrThat.json');

exports.run = (Bastion, message) => {
  message.channel.send({
    embed: {
      color: Bastion.colors.blue,
      description: question[Math.floor(Math.random() * question.length)]
      // description: question.random()
    }
  }).catch(e => {
    Bastion.log.error(e);
  });
};

exports.config = {
  aliases: [ 'thisthat' ],
  enabled: true
};

exports.help = {
  name: 'thisorthat',
  description: string('thisOrThat', 'commandDescription'),
  botPermission: '',
  userPermission: '',
  usage: 'thisOrThat',
  example: []
};
