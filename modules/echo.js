/**
 * @file echo command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.exec = (Bastion, message, args) => {
  if (args.length < 1) {
    /**
     * The command was ran with invalid parameters.
     * @fires commandUsage
     */
    return Bastion.emit('commandUsage', message, this.help);
  }

  message.channel.send({
    embed: {
      color: Bastion.colors.DEFAULT,
      description: args.join(' '),
      footer: {
        text: `${Bastion.credentials.ownerId.includes(message.author.id) ? '' : 'This is not an official message from Bastion or from it\'s creators.'}`
      }
    }
  }).catch(e => {
    Bastion.log.error(e);
  });
};

exports.config = {
  aliases: [ 'say' ],
  enabled: true
};

exports.help = {
  name: 'echo',
  botPermission: '',
  userTextPermission: 'MANAGE_GUILD',
  userVoicePermission: '',
  usage: 'echo <text>',
  example: [ 'echo Hello, world!' ]
};
