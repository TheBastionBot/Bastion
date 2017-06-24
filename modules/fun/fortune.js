/**
 * @file fortune command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const fortuneCookies = require('../../data/fortuneCookies.json');
const string = require('../../handlers/languageHandler');

exports.run = (Bastion, message) => {
  message.channel.send({
    embed: {
      color: Bastion.colors.blue,
      title: 'Fortune:',
      description: fortuneCookies[Math.floor(Math.random() * fortuneCookies.length)]
      // description: fortuneCookies.random()
    }
  }).catch(e => {
    Bastion.log.error(e.stack);
  });
};

exports.config = {
  aliases: [ 'cookie' ],
  enabled: true
};

exports.help = {
  name: 'fortune',
  description: string('fortune', 'commandDescription'),
  botPermission: '',
  userPermission: '',
  usage: 'fortune',
  example: []
};
