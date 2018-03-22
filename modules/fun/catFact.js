/**
 * @file catFact command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const catFacts = require('../../data/catFacts.json');

exports.exec = (Bastion, message) => {
  message.channel.send({
    embed: {
      color: Bastion.colors.BLUE,
      title: 'Cat Fact:',
      description: catFacts[Math.floor(Math.random() * catFacts.length)]
      // description: catFacts.random()
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
  name: 'catFact',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'catfact',
  example: []
};
