/**
 * @file giphy command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const string = require('../../handlers/languageHandler');
const gifSearch = require('gif-search');

exports.run = (Bastion, message, args) => {
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
  description: string('giphy', 'commandDescription'),
  botPermission: '',
  userPermission: '',
  usage: 'giphy <query>',
  example: [ 'giphy iron man' ]
};
