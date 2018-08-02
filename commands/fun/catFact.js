/**
 * @file catFact command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

const catFacts = xrequire('./assets/catFacts.json');

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
  description: 'Shows a random fact about cats.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'catfact',
  example: []
};
