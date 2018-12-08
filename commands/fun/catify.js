/**
 * @file catify command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

const request = xrequire('request-promise-native');

exports.exec = async (Bastion, message, args) => {
  let string = args.length ? args.join(' ') : message.author.tag;

  let options = {
    url: `https://robohash.org/${encodeURIComponent(string)}?set=set4`,
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
  name: 'catify',
  description: 'Generates a random kitten image from the given string or your Discord tag if no string is specified.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'catify [Random String]',
  example: [ 'catify', 'catify isotope cattle hazily muzzle' ]
};
