/**
 * @file cite command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

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
      Bastion.log.error(e.stack);
    });
  }).catch(e => {
    if (e.stack.includes('Unknown Message')) {
      /**
       * Error condition is encountered.
       * @fires error
       */
      Bastion.emit('error', 'Not Found', 'No message was found for the given parameter.', message.channel);
    }
    else {
      Bastion.log.error(e.stack);
    }
  });
};

exports.config = {
  aliases: [],
  enabled: true
};

exports.help = {
  name: 'cite',
  description: 'Cites a users message, specified by the message ID, in the channel.',
  botPermission: '',
  userPermission: '',
  usage: 'cite <MESSAGE_ID>',
  example: [ 'cite 221133446677558899' ]
};
