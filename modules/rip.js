/**
 * @file rip command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.exec = (Bastion, message, args) => {
  message.channel.send({
    embed: {
      color: Bastion.colors.BLUE,
      title: `R.I.P ${args.length ? args.join(' ') : 'Everything'}`,
      image: {
        url: 'https://resources.bastionbot.org/images/tombstone_rip.png'
      },
      footer: {
        text: 'May the Soul Rest in Peace.'
      }
    }
  }).catch(e => {
    Bastion.log.error(e);
  });
};

exports.config = {
  aliases: [],
  enabled: true
};

exports.help = {
  name: 'rip',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'rip <text>',
  example: [ 'rip Grammar' ]
};
