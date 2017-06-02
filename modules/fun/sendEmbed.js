/**
 * @file sendEmbed command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.run = (Bastion, message, args) => {
  if (args.length < 1) {
    /**
     * The command was ran with invalid parameters.
     * @fires commandUsage
     */
    return Bastion.emit('commandUsage', message, this.help);
  }

  try {
    args = JSON.parse(args.join(' '));
  }
  catch (e) {
    return message.channel.send({
      embed: {
        color: Bastion.colors.red,
        description: 'Invalid embed object. Please check that it\'s an valid embed object or create one [here](https://bastion.js.org/tools/embed_builder/).' +
                     `\`\`\`${e.toString()}\`\`\``
      }
    }).catch(e => {
      Bastion.log.error(e.stack);
    });
  }

  message.channel.send({
    embed: args
  }).then(() => {
    if (message.deletable) {
      message.delete().catch(e => {
        Bastion.log.error(e.stack);
      });
    }
  }).catch(e => {
    Bastion.log.error(e.stack);
  });
};

exports.config = {
  aliases: [],
  enabled: true
};

exports.help = {
  name: 'sendembed',
  description: 'Sends an embed message created from the specified embed JavaScript object. To create an embed object, graphically, [click here](https://bastion.js.org/tools/embed_builder/).',
  botPermission: '',
  userPermission: '',
  usage: 'sendEmbed <embedObject>',
  example: [ 'sendEmbed {"title": "Hello", "description": "Isn\'t it cool?"}' ]
};
