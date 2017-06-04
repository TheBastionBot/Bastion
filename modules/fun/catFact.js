/**
 * @file catFact command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const catFacts = require('../../data/catFacts.json');

exports.run = (Bastion, message) => {
  message.channel.send({
    embed: {
      color: Bastion.colors.blue,
      title: 'Cat Fact:',
      description: catFacts[Math.floor(Math.random() * catFacts.length)]
      // description: catFacts.random()
    }
  }).catch(e => {
    Bastion.log.error(e.stack);
  });
};

exports.config = {
  aliases: [],
  enabled: true
};

exports.help = {
  name: 'catfact',
  description: 'Shows a random catfact.',
  botPermission: '',
  userPermission: '',
  usage: 'catfact',
  example: []
};
