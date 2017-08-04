/**
 * @file cite command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const string = require('../../handlers/languageHandler');

exports.run = async (Bastion, message, args) => {
  if (args.length < 1 || !(parseInt(args[0]) < 9223372036854775807)) {
    /**
     * The command was ran with invalid parameters.
     * @fires commandUsage
     */
    return Bastion.emit('commandUsage', message, this.help);
  }

  try {
    let citedMessage = await message.channel.fetchMessage(args[0]);

    message.channel.send({
      embed: {
        color: Bastion.colors.blue,
        author: {
          name: citedMessage.author.tag,
          icon_url: citedMessage.author.avatarURL
        },
        description: citedMessage.content,
        timestamp: citedMessage.createdAt
      }
    }).catch(e => {
      Bastion.log.error(e);
    });
  }
  catch (e) {
    if (e.toString().includes('Unknown Message')) {
      /**
      * Error condition is encountered.
      * @fires error
      */
      Bastion.emit('error', string('notFound', 'errors'), string('messageNotFound', 'errorMessage'), message.channel);
    }
    else {
      Bastion.log.error(e);
    }
  }
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
