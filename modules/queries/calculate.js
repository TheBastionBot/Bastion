/**
 * @file calculate command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const mathjs = require('mathjs');

exports.run = (Bastion, message, args) => {
  if (args.length < 1) {
    /**
     * The command was ran with invalid parameters.
     * @fires commandUsage
     */
    return Bastion.emit('commandUsage', message, this.help);
  }

  try {
    message.channel.send({
      embed: {
        color: Bastion.colors.blue,
        title: 'Result:',
        description: mathjs.eval(args.join(' ')).toFixed(2)
      }
    });
  }
  catch(err) {
    message.channel.send({
      embed: {
        color: Bastion.colors.red,
        description: 'Invalid mathematical expression!'
      }
    }).catch(e => {
      Bastion.log.error(e.stack);
    });
  }
};

exports.config = {
  aliases: [ 'calc' ],
  enabled: true
};

exports.help = {
  name: 'calculate',
  description: 'Evaluates a mathematical expression.',
  botPermission: '',
  userPermission: '',
  usage: 'calculate <mathematical_expression>',
  example: [ 'calculate 9 * 10 - 11' ]
};
