/**
 * @file reverse command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.run = (Bastion, message, args) => {
  if (args.length < 1) {
    return message.channel.send({
      embed: {
        color: Bastion.colors.yellow,
        title: 'Usage',
        description: `\`${Bastion.config.prefix}${this.help.usage}\``
      }
    }).catch(e => {
      Bastion.log.error(e.stack);
    });
  }

  message.channel.send({
    embed: {
      color: Bastion.colors.blue,
      title: 'Reversed Text:',
      description: args.join(' ').split('').reverse().join('')
    }
  }).catch(e => {
    Bastion.log.error(e.stack);
  });
};

exports.config = {
  aliases: [ 'rev' ],
  enabled: true
};

exports.help = {
  name: 'reverse',
  description: 'Reverse a given text.',
  botPermission: '',
  userPermission: '',
  usage: 'reverse <text>',
  example: [ 'reverse !looc si sihT' ]
};
