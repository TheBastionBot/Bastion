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

  return message.author.send({
    embed: {
      color: message.client.colors.BLUE,
      title: 'SPOILER ALERT!',
      description: Bastion.methods.rot13(args.join(' ')),
      footer: {
        text: 'You chose to view this spoiler. Don\'t blame me!'
      }
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
  description: 'Decodes the spoiler message, sent via `sendSpoiler` command and sends you the decoded message via DM.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'showSpoiler <ENCODED SPOILER MESSAGE>',
  example: [ 'sendSpoiler Lbh xabj, Gunabf jnf xvyyrq ol...?' ]
};
