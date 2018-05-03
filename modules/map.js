/**
 * @file map command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const request = require('request-promise-native');

exports.exec = async (Bastion, message, args) => {
  try {
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

    let options = {
      url: `https://maps.googleapis.com/maps/api/staticmap?center=${encodeURIComponent(args[0])}&zoom=${args[1]}&size=600x300&maptype=roadmap%20&markers=color:blue|${encodeURIComponent(args[0])}&key=${Bastion.credentials.googleAPIkey}`,
      encoding: null
    };
    let response = await request(options);

    message.channel.send({
      files: [ { attachment: response } ]
    }).catch(e => {
      Bastion.log.error(e);
    });
  }
  catch (e) {
    if (e.response) {
      return Bastion.emit('error', e.response.statusCode, e.response.statusMessage, message.channel);
    }
    Bastion.log.error(e);
  }
};

exports.config = {
  aliases: [],
  enabled: true
};

exports.help = {
  name: 'map',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'map <location> [--zoom <amount>]',
  example: [ 'map New York, NY', 'map London Eye, London --zoom 18' ]
};
