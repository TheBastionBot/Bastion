/**
 * @file robotify command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const request = require('request-promise-native');

exports.exec = async (Bastion, message, args) => {
  try {
    let string;
    if (args.length < 1) {
      string = message.author.tag;
    }
    else {
      string = args.join(' ');
    }

    let options = {
      url: `https://robohash.org/${encodeURIComponent(string)}?set=set0`,
      encoding: null
    };
    let response = await request(options);

    message.channel.send({
      files: [ { attachment: response } ]
    }).catch(e => {
      Bastion.log.error(e);
    });
  }
  catch (e) {
    if (e.response) {
      return Bastion.emit('error', e.response.statusCode, e.response.statusMessage, message.channel);
    }
    Bastion.log.error(e);
  }
};

exports.config = {
  aliases: [ 'botify' ],
  enabled: true
};

exports.help = {
  name: 'robotify',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'robotify [Random String]',
  example: [ 'robotify', 'robotify isotope cattle hazily muzzle' ]
};
