/**
 * @file calculate command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const string = require('../../handlers/languageHandler');
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
        color: Bastion.colors.BLUE,
        title: 'Result:',
        description: mathjs.eval(args.join(' ')).toFixed(2)
      }
    });
  }
  catch (error) {
    /**
     * Error condition is encountered.
     * @fires error
     */
    return Bastion.emit('error', string('invalidInput', 'errors'), string('invalidInput', 'errorMessage', 'mathematical expression'), message.channel);
  }
};

exports.config = {
  aliases: [ 'calc' ],
  enabled: true
};

exports.help = {
  name: 'calculate',
  description: string('calculate', 'commandDescription'),
  botPermission: '',
  userPermission: '',
  usage: 'calculate <mathematical_expression>',
  example: [ 'calculate 9 * 10 - 11' ]
};
