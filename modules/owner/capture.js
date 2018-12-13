/**
 * @file capture command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const request = require('request-promise-native');

exports.exec = async (Bastion, message, args) => {
  if (!args.url) {
    /**
     * The command was ran with invalid parameters.
     * @fires commandUsage
     */
    return Bastion.emit('commandUsage', message, this.help);
  }

  if (!/^(http[s]?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&/=]*)$/.test(args.url)) {
    /**
     * Error condition is encountered.
     * @fires error
     */
    return Bastion.emit('error', Bastion.strings.error(message.guild.language, 'invalidInput'), Bastion.strings.error(message.guild.language, 'invalidInput', true, 'URL'), message.channel);
  }

  let options = {
    url: `https://api.bastionbot.org/url/capture?url=${args.url}`,
    headers: {
      'User-Agent': 'Bastion Discord Bot (https://bastionbot.org)'
    },
    json: true,
    encoding: null
  };

  let response = await request(options);
  let webshot = Buffer.from(response);

  await message.channel.send({
    files: [ { attachment: webshot, name: 'capture.png' } ]
  });
};

exports.config = {
  aliases: [],
  enabled: true,
  ownerOnly: true,
  argsDefinitions: [
    { name: 'url', type: String, defaultOption: true }
  ]
};

exports.help = {
  name: 'capture',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'capture <url>',
  example: [ 'capture BastionBot.org' ]
};
