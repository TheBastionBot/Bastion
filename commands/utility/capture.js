/**
 * @file capture command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

exports.exec = async (Bastion, message, args) => {
  if (!args.url) {
    return Bastion.emit('commandUsage', message, this.help);
  }

  if (!/^(http[s]?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&/=]*)$/.test(args.url)) {
    return Bastion.emit('error', '', Bastion.i18n.error(message.guild.language, 'invalidInput', 'URL'), message.channel);
  }

  let webshot = await Bastion.methods.makeBWAPIRequest('/url/capture', {
    encoding: null,
    qs: {
      url: args.url
    }
  });

  webshot = Buffer.from(webshot);

  await message.channel.send({
    files: [ { attachment: webshot, name: 'capture.png' } ]
  });
};

exports.config = {
  aliases: [],
  enabled: true,
  argsDefinitions: [
    { name: 'url', type: String, defaultOption: true }
  ]
};

exports.help = {
  name: 'capture',
  description: 'Captures a screenshot of the specified webpage.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'capture <url>',
  example: [ 'capture https://bastion.traction.one' ]
};
