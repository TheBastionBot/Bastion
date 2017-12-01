/**
 * @file giphy command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const gifSearch = require('gif-search');

exports.exec = (Bastion, message, args) => {
  if (args.length < 1) {
    /**
     * The command was ran with invalid parameters.
     * @fires commandUsage
     */
    return Bastion.emit('commandUsage', message, this.help);
  }

  gifSearch.random(args.join(' ')).then(gifURL => {
    message.channel.send({
      files: [ { attachment: gifURL } ]
    }).catch(e => {
      Bastion.log.error(e);
    });
  });
};

exports.config = {
  aliases: [ 'gif' ],
  enabled: true
};

exports.help = {
  name: 'giphy',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'giphy <query>',
  example: [ 'giphy iron man' ]
};
