/**
 * @file pat command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const request = require('request-promise-native');

exports.exec = async (Bastion, message) => {
  let options = {
    url: 'http://api.giphy.com/v1/gifs/search',
    qs: {
      q: 'pat',
      api_key: 'dc6zaTOxFJmzC',
      limit: 10,
      offset: 0
    },
    json: true
  };

  let response = await request(options);

  if (!response.data.length) {
    return Bastion.emit('error', Bastion.strings.error(message.guild.language, 'notFound'), Bastion.strings.error(message.guild.language, 'notFound', true, 'image'), message.channel);
  }

  await message.channel.send({
    embed: {
      color: Bastion.colors.BLUE,
      title: `A pat from ${message.author.tag}`,
      image: {
        url: response.data[Math.floor(Math.random() * response.data.length)].images.original.url
      },
      footer: {
        text: 'Powered by GIPHY'
      }
    }
  });
};

exports.config = {
  aliases: [],
  enabled: true
};

exports.help = {
  name: 'pat',
  description: 'Pat someone!',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'pat',
  example: [ 'pat' ]
};
