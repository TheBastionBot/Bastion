/**
 * @file capture command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const string = require('../../handlers/languageHandler');
const capture = require('webshot');

exports.run = (Bastion, message, args) => {
  if (args.length < 1) {
    /**
     * The command was ran with invalid parameters.
     * @fires commandUsage
     */
    return Bastion.emit('commandUsage', message, this.help);
  }

  if (!/^(http[s]?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&/=]*)$/.test(args[0])) {
    /**
     * Error condition is encountered.
     * @fires error
     */
    return Bastion.emit('error', string('invalidInput', 'errors'), string('invalidInput', 'errorMessage', 'URL'), message.channel);
  }
  let options = {
    windowSize: {
      width: 1366,
      height: 768
    },
    shotSize: {
      width: 'all',
      height: 'all'
    },
    timeout: 15000,
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_3) AppleWebKit/537.75.14 (KHTML, like Gecko) Version/7.0.3 Safari/7046A194A'
  };
  capture(args[0], options, function (err, renderStream) {
    if (err) {
      /**
       * Error condition is encountered.
       * @fires error
       */
      return Bastion.emit('error', string('connection', 'errors'), `Bastion can't find the server at **${args[0]}**.\n• Check the address for typing errors such as **ww**.example.com instead of **www**.example.com\n• Connection may've been timed out, try again later.`, message.channel);
    }
    let imageBuffers = [];
    renderStream.on('data', function (data) {
      imageBuffers.push(data);
    });
    renderStream.on('end', function () {
      let imageBuffer = Buffer.concat(imageBuffers);
      if (imageBuffer.length > 0) {
        message.channel.send({
          file: {
            attachment: imageBuffer,
            name: 'capture.jpg'
          }
        }).catch(e => {
          Bastion.log.error(e);
        });
      }
    });
  });
};

exports.config = {
  aliases: [],
  enabled: true
};

exports.help = {
  name: 'capture',
  description: string('capture', 'commandDescription'),
  botPermission: '',
  userPermission: '',
  usage: 'capture <url>',
  example: [ 'capture bastion.js.org' ]
};
