/**
 * @file cite command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const string = require('../../handlers/languageHandler');

exports.run = (Bastion, message, args) => {
  if (args.length < 1 || !(parseInt(args[0]) < 9223372036854775807)) {
    /**
     * The command was ran with invalid parameters.
     * @fires commandUsage
     */
    return Bastion.emit('commandUsage', message, this.help);
  }

  message.channel.fetchMessage(args[0]).then(msg => {
    message.channel.send({
      embed: {
        color: Bastion.colors.blue,
        author: {
          name: msg.author.tag,
          icon_url: msg.author.avatarURL
        },
        description: msg.content,
        timestamp: msg.createdAt
      }
    }).catch(e => {
      Bastion.log.error(e);
    });
  }).catch(e => {
    if (e.stack.includes('Unknown Message')) {
      /**
       * Error condition is encountered.
       * @fires error
       */
      Bastion.emit('error', string('notFound', 'errors'), string('notFound', 'errorMessage', 'message'), message.channel);
    }
    else {
      Bastion.log.error(e);
    }
  });
};

exports.config = {
  aliases: [],
  enabled: true
};

exports.help = {
  name: 'cite',
  description: string('cite', 'commandDescription'),
  botPermission: '',
  userPermission: '',
  usage: 'cite <MESSAGE_ID>',
  example: [ 'cite 221133446677558899' ]
};
