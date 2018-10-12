/**
 * @file calculate command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

const mathjs = xrequire('mathjs');

exports.exec = (Bastion, message, args) => {
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
    return Bastion.emit('error', '', Bastion.i18n.error(message.guild.language, 'invalidInput', 'mathematical expression'), message.channel);
  }
};

exports.config = {
  aliases: [ 'calc' ],
  enabled: true
};

exports.help = {
  name: 'calculate',
  description: 'Evaluates any mathematical expression.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'calculate <mathematical_expression>',
  example: [ 'calculate 9 * 10 - 11' ]
};
