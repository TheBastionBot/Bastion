/**
 * @file hello command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.run = (Bastion, message) => {
  message.channel.send({
    embed: {
      color: Bastion.colors.grey,
      description: 'Hi! I\'m **Bastion**. \u{1F609}\n' +
                   'I\'m a BOT that is going to make your time it this Discord Server amazing!',
      footer: {
        text: `Type ${Bastion.config.prefix}help to find out more about me.`
      }
    }
  }).catch(e => {
    Bastion.log.error(e.stack);
  });
};

exports.config = {
  aliases: [ 'hi' ],
  enabled: true
};

exports.help = {
  name: 'hello',
  description: 'Get to know Bastion!',
  botPermission: '',
  userPermission: '',
  usage: 'hello',
  example: []
};
