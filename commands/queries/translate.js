/**
 * @file translate command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

const translate = xrequire('@k3rn31p4nic/google-translate-api');

exports.exec = async (Bastion, message, args) => {
  try {
    if (args.length < 2) {
      /**
      * The command was ran with invalid parameters.
      * @fires commandUsage
      */
      return Bastion.emit('commandUsage', message, this.help);
    }

    let result = await translate(args.slice(1).join(' '), { to: args[0] });

    message.channel.send({
      embed: {
        color: Bastion.colors.BLUE,
        description: result.text,
        footer: {
          text: `Powered by Google • Translation from ${result.from.language.iso.toUpperCase()} to ${args[0].toUpperCase()}`
        }
      }
    }).catch(e => {
      Bastion.log.error(e);
    });
  }
  catch (e) {
    if (e.stack.includes('not supported')) {
      /**
      * Error condition is encountered.
      * @fires error
      */
      return Bastion.emit('error', '', Bastion.i18n.error(message.guild.language, 'invalidInput', 'language code'), message.channel);
    }
    Bastion.log.error(e);
  }
};

exports.config = {
  aliases: [ 'trans' ],
  enabled: true
};

exports.help = {
  name: 'translate',
  description: 'Translates your message to the specified language.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'translate <language_code> <text>',
  example: [ 'translate EN Je suis génial!' ]
};
