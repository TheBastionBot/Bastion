/**
 * @file remove command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.exec = (Bastion, message, args) => {
  message.channel.send({
    embed: {
      color: Bastion.colors.BLUE,
      title: `${args.length ? args.join(' ') : 'You'} is being removed.`,
      image: {
        url: 'https://resources.bastionbot.org/images/remove_button.gif'
      }
    }
  }).catch(e => {
    Bastion.log.error(e);
  });
};

exports.config = {
  aliases: [ 'delete' ],
  enabled: true
};

exports.help = {
  name: 'remove',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'remove <text>',
  example: [ 'remove Humanity' ]
};
