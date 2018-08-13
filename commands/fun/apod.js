/**
 * @file apod command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

const request = xrequire('request-promise-native');

exports.exec = async (Bastion, message) => {
  try {
    let options = {
      method: 'GET',
      url: 'https://api.nasa.gov/planetary/apod',
      qs: {
        api_key: Bastion.credentials.NASAAPIKey || 'DEMO_KEY'
      },
      followAllRedirects: true,
      json: true
    };
    let response = await request(options);

    await message.channel.send({
      embed: {
        color: Bastion.colors.BLUE,
        author: {
          name: 'Astronomy Picture of the Day',
          url: 'http://apod.nasa.gov/'
        },
        title: response.title,
        description: response.explanation,
        image: {
          url: response.hdurl || response.url
        },
        footer: {
          text: `Powered by NASA • Image Credit & Copyright - ${response.copyright}`
        }
      }
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
  name: 'apod',
  description: 'Discover the cosmos! Each day a different image or photograph of our fascinating universe is featured, along with a brief explanation written by a professional astronomer.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'apod',
  example: []
};
