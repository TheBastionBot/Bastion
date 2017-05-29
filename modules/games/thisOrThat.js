/**
 * @file thisOrThat command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const question = require('../../data/thisOrThat.json');

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
  aliases: [ 'thisthat' ],
  enabled: true
};

exports.help = {
  name: 'thisorthat',
  description: 'Asks you a this or that question. Let\'s see how is your choice!',
  botPermission: '',
  userPermission: '',
  usage: 'thisOrThat',
  example: []
};
