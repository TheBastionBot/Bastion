/**
 * @file robotify command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const request = require('request');

exports.exec = (Bastion, message, args) => {
  let string;
  if (args.length < 1) {
    string = message.author.tag;
  }
  else {
    string = args.join(' ');
  }

  let url = `https://robohash.org/${encodeURIComponent(string)}`;
  request({ url: url, encoding: null }, function (err, res, body) {
    if (err) {
      /**
       * Error condition is encountered.
       * @fires error
       */
      return Bastion.emit('error', Bastion.strings.error(message.guild.language, 'connection'), Bastion.strings.error(message.guild.language, 'connection', true), message.channel);
    }

    message.channel.send({ files: [ { attachment: body } ] }).catch(e => {
      Bastion.log.error(e);
    });
  });
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
