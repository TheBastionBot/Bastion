/**
 * @file cite command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

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

    let image;
    if (citedMessage.attachments.size) {
      if (citedMessage.attachments.first().height) {
        image = citedMessage.attachments.first().url;
      }
    }

    message.channel.send({
      embed: {
        color: Bastion.colors.BLUE,
        author: {
          name: citedMessage.author.tag,
          icon_url: citedMessage.author.avatarURL
        },
        description: citedMessage.content,
        image: {
          url: image
        },
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
      Bastion.emit('error', Bastion.strings.error(message.guild.language, 'notFound'), Bastion.strings.error(message.guild.language, 'messageNotFound', true), message.channel);
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
  botPermission: '',
  userPermission: '',
  usage: 'cite <MESSAGE_ID>',
  example: [ 'cite 221133446677558899' ]
};
