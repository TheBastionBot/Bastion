/**
 * @file shorten command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

const request = xrequire('request-promise-native');

exports.exec = async (Bastion, message, args) => {
  if (!args.length) {
    return Bastion.emit('commandUsage', message, this.help);
  }

  args = encodeURI(args.join(' '));
  if (!/^(http[s]?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&/=]*)$/i.test(args)) {
    return Bastion.emit('error', '', Bastion.i18n.error(message.guild.language, 'invalidInput', 'URL'), message.channel);
  }

  let options = {
    url: `https://www.googleapis.com/urlshortener/v1/url?key=${Bastion.credentials.googleAPIkey}`,
    method: 'POST',
    json: {
      longUrl: args
    }
  };

  let response = await request(options);

  await message.channel.send({
    embed: {
      color: Bastion.colors.BLUE,
      fields: [
        {
          name: 'Long URL',
          value: args
        },
        {
          name: 'Short URL',
          value: response.id
        }
      ],
      footer: {
        text: 'Powered by Google'
      }
    }
  });
};

exports.config = {
  aliases: [],
  enabled: true
};

exports.help = {
  name: 'shorten',
  description: 'Shortens a specified URL using Google URL Shortener.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'shorten <URL>',
  example: [ 'shorten https://bastion.traction.one/SomeLongURL' ]
};
