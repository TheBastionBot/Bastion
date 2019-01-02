/**
 * @file map command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

const request = xrequire('request-promise-native');

exports.exec = async (Bastion, message, args) => {
  if (!args.length) {
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

  await message.channel.send({
    files: [ { attachment: response } ]
  });
};

exports.config = {
  aliases: [],
  enabled: true
};

exports.help = {
  name: 'map',
  description: 'Get the map of the specified location.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'map <location> [--zoom <amount>]',
  example: [ 'map New York, NY', 'map London Eye, London --zoom 18' ]
};
