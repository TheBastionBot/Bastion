/**
 * @file sendSpoiler command
 * @author Alexandre Hamel (a.k.a hamelatoire)
 * @license GPL-3.0
 */

/**
 * This function sends an encrypted message to an channel.
 * The message is usually a spoiler.
 * @param message
 * @param Bastion
 */
function sendSpoiler(message, Bastion) {
  const indexOfFirstSpace = message.content.indexOf(' ');
  const indexOfSecondSpace = message.content.indexOf(' ', indexOfFirstSpace + 1);
  const channelId = message.content.substring(indexOfFirstSpace, indexOfSecondSpace).trim();
  const text = message.content.substring(indexOfSecondSpace).trimLeft();
  message.client.channels.get(channelId).send({
    embed: {
      color: message.client.colors.BLUE,
      title: `This message from ${message.author.username} contains spoilers, so I encrypted it`,
      description: 'To decrypt the message, use the showSpoiler command followed by the spoiler and I\'ll DM you the decrypted text.',
      fields: [
        {
          name: 'Here is the encrypted text',
          value: Bastion.methods.rot13(text.trimLeft())
        }
      ]
    }
  }).catch(e => {
    message.client.log.error(e);
  });
}

exports.exec = (Bastion, message, args) => {
  if (args.length < 2) {
    /**
     * The command was ran with invalid parameters.
     * @fires commandUsage
     */
    return Bastion.emit('commandUsage', message, this.help);
  }

  sendSpoiler(message, Bastion).catch(e => {
    Bastion.log.error(e);
  });
};

exports.config = {
  aliases: [],
  enabled: true
};

exports.help = {
  name: 'sendSpoiler',
  description: 'Sends the message that you had sent, rot13 encoded.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'sendSpoiler <channelId> <text>',
  example: [ 'sendSpoiler 99999999999999999 insert spoiler here' ]
};
