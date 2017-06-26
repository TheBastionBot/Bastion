/**
 * @file choose command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const string = require('../../handlers/languageHandler');

exports.run = (Bastion, message, args) => {
  if (args.length < 1 || !/^(.+( ?\/ ?.+[^/])+)$/i.test(args = args.join(' '))) {
    /**
     * The command was ran with invalid parameters.
     * @fires commandUsage
     */
    return Bastion.emit('commandUsage', message, this.help);
  }

  args = args.split('/');
  message.channel.send({
    embed: {
      color: Bastion.colors.blue,
      title: 'In my opinion',
      description: args[Math.floor(Math.random() * args.length)]
      // description: args.split('/').random()
    }
  }).catch(e => {
    Bastion.log.error(e.stack);
  });
};

exports.config = {
  aliases: [ 'decide' ],
  enabled: true
};

exports.help = {
  name: 'choose',
  description: string('choose', 'commandDescription'),
  botPermission: '',
  userPermission: '',
  usage: 'choose <choice1>/<choice2>[/<choice3>][...]',
  example: [ 'choose Chocolate/Ice Cream/Cake' ]
};
