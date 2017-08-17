/**
 * @file echo command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const string = require('../../handlers/languageHandler');

exports.run = (Bastion, message, args) => {
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
      description: args.join(' ')
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
  description: string('echo', 'commandDescription'),
  botPermission: '',
  userPermission: '',
  usage: 'echo <text>',
  example: [ 'echo Hello, world!' ]
};
