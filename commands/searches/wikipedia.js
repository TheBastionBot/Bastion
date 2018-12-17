/**
 * @file wikipedia command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

const request = xrequire('request-promise-native');

exports.exec = async (Bastion, message, args) => {
  if (!args.length) {
    return Bastion.emit('commandUsage', message, this.help);
  }

  let options = {
    url: `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=extracts|info|pageimages&exsentences=10&exintro=true&explaintext=true&inprop=url&pithumbsize=512&redirects=1&formatversion=2&titles=${args.join(' ')}`,
    json: true
  };

  let response = await request(options);

  let color, description = '', data = [], thumbnail = '';
  color = Bastion.colors.BLUE;
  response = response.query.pages[0];

  if (response.missing) {
    color = Bastion.colors.RED;
    description = `**${args.join(' ')}** was not found in Wikipedia.`;
  }
  else {
    data = [
      {
        name: response.title || args.join(' '),
        value: `${response.extract.length < 1000 ? response.extract : response.extract.slice(0, 950)}... [Read More](${response.fullurl})`
      }
    ];
    thumbnail = response.thumbnail ? response.thumbnail.source : 'https://upload.wikimedia.org/wikipedia/en/thumb/8/80/Wikipedia-logo-v2.svg/1122px-Wikipedia-logo-v2.svg.png';
  }

  await message.channel.send({
    embed: {
      color: color,
      title: 'Wikipedia',
      description: description,
      fields: data,
      thumbnail: {
        url: thumbnail
      },
      footer: {
        text: 'Powered by Wikipedia'
      }
    }
  });
};

exports.config = {
  aliases: [ 'wiki' ],
  enabled: true
};

exports.help = {
  name: 'wikipedia',
  description: 'Searches Wikipedia for the specified article.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'wikipedia <text>',
  example: [ 'wikipedia Steve Jobs' ]
};
