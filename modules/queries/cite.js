/**
 * @file cite command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.run = (Bastion, message, args) => {
  if (args.length < 1 || !/^[0-9]{18}$/.test(args[0])) {
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
      message.channel.send({
        embed: {
          color: Bastion.colors.red,
          description: 'No message was found with the specified Message ID in this channel.'
        }
      }).catch(e => {
        Bastion.log.error(e.stack);
      });
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
