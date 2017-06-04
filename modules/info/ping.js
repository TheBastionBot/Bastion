/**
 * @file ping command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.run = (Bastion, message) => {
  message.channel.send({
    embed: {
      color: Bastion.colors.dark_grey,
      description: `${parseInt(Bastion.ping)}ms`
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
  name: 'ping',
  description: 'Pings the bot and shows you the time the bot responded in.',
  botPermission: '',
  userPermission: '',
  usage: 'ping',
  example: []
};
