/**
 * @file map command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const request = require('request');

exports.run = (Bastion, message, args) => {
  if (args.length < 1) {
    /**
     * The command was ran with invalid parameters.
     * @fires commandUsage
     */
    return Bastion.emit('commandUsage', message, this.help);
  }

  args = args.join(' ').split('--zoom');
  for (let i = 0; i < args.length; i++) {
    args[i] = args[i].trim();
  }
  args[1] = args[1] && args[1] >= 0 && args[1] <= 20 ? args[1] : 13;

  request({ url: `https://maps.googleapis.com/maps/api/staticmap?center=${encodeURIComponent(args[0])}&zoom=${args[1]}&size=600x300&maptype=roadmap%20&markers=color:blue|${encodeURIComponent(args[0])}&key=${Bastion.credentials.googleAPIkey}`, encoding: null }, function (err, res, body) {
    if (err) {
      Bastion.log.error(err);
      return message.channel.send({
        embed: {
          color: Bastion.colors.red,
          description: 'Some error has occured, please check the console.'
        }
      }).catch(e => {
        Bastion.log.error(e.stack);
      });
    }
    message.channel.send({ files: [ { attachment: body } ] }).catch(e => {
      Bastion.log.error(e.stack);
    });
  });
};

exports.config = {
  aliases: [],
  enabled: true
};

exports.help = {
  name: 'map',
  description: 'Get the map of the specified location. It takes an optional `--zoom` argument which takes an zoom amount from value 0 to 20.',
  botPermission: '',
  userPermission: '',
  usage: 'map <location> [--zoom <amount>]',
  example: [ 'map New York, NY', 'map London Eye, London --zoom 18' ]
};
