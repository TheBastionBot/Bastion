/**
 * @file showSpoiler command
 * @author Alexandre Hamel (a.k.a hamelatoire)
 * @license GPL-3.0
 */

exports.exec = (Bastion, message, args) => {
  if (args.length < 1) {
    /**
     * The command was ran with invalid parameters.
     * @fires commandUsage
     */
    return Bastion.emit('commandUsage', message, this.help);
  }

  const firstLetterOfMessage = message.content.indexOf('3') + 1;
  const text = message.content.substring(firstLetterOfMessage);
  return message.author.send({
    embed: {
      color: message.client.colors.BLUE,
      title: 'Here is your decrypted spoiler',
      description: Bastion.methods.rot13(text.trimLeft())
    }
  }).catch(e => {
    message.client.log.error(e);
  });
};

exports.config = {
  aliases: [],
  enabled: true
};

exports.help = {
  name: 'showSpoiler',
  description: 'This command decrypt a message and DMs it to you.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'showSpoiler <text>',
  example: [ 'sendSpoiler insert spoiler here' ]
};
