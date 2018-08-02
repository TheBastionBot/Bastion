/**
 * @file sendEmbed command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

exports.exec = (Bastion, message, args) => {
  try {
    if (args.length < 1) {
      /**
      * The command was ran with invalid parameters.
      * @fires commandUsage
      */
      return Bastion.emit('commandUsage', message, this.help);
    }

    args = JSON.parse(args.join(' '));
    args.footer = {
      text: `${Bastion.credentials.ownerId.includes(message.author.id) ? '' : 'This is not an official message from Bastion or from its creators.'}`
    };

    message.channel.send({
      embed: args
    }).then(() => {
      if (message.deletable) {
        message.delete().catch(e => {
          Bastion.log.error(e);
        });
      }
    }).catch(e => {
      Bastion.log.error(e);
    });
  }
  catch (e) {
    /**
     * Error condition is encountered.
     * @fires error
     */
    return Bastion.emit('error', '', `${Bastion.i18n.error(message.guild.language, 'invalidEmbedObject')}\`\`\`${e.toString()}\`\`\``, message.channel);
  }
};

exports.config = {
  aliases: [],
  enabled: true
};

exports.help = {
  name: 'sendEmbed',
  description: 'Sends an embed message from the specified embed (JavaScript) object. *To create an embed object, graphically, [click here](%website%/embedbuilder/).*',
  botPermission: '',
  userTextPermission: 'MANAGE_GUILD',
  userVoicePermission: '',
  usage: 'sendEmbed <embedObject>',
  example: [ 'sendEmbed {"title": "Hello", "description": "Isn\'t it cool?"}' ]
};
