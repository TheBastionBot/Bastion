/**
 * @file zalgolize command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const zalgo = require('zalgolize');

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
      color: Bastion.colors.blue,
      title: 'Zalgolized Text:',
      description: zalgo(args.join(' '))
    }
  }).catch(e => {
    Bastion.log.error(e.stack);
  });
};

exports.config = {
  aliases: [ 'zalgo' ],
  enabled: true
};

exports.help = {
  name: 'zalgolize',
  description: 'Zalgolizes a given text.',
  botPermission: '',
  userPermission: '',
  usage: 'zaloglize <text>',
  example: [ 'zaloglize It looks clumsy, but it\'s cool!' ]
};
