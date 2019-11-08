/**
 * @file teamtrees command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

const request = xrequire('request-promise-native');
const cheerio = xrequire('cheerio');

exports.exec = async (Bastion, message) => {
  let options = {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:68.0) Gecko/20100101 Firefox/68.0'
    },
    url: 'https://teamtrees.org/'
  };
  let response = await request(options);

  let $ = cheerio.load(response);

  await message.channel.send({
    embed: {
      color: Bastion.colors.BLUE,
      title: `${$('#totalTrees').attr('data-count')} TREES PLANTED!`,
      author: {
        name: '🌲 #TeamTrees',
        icon: 'https://teamtrees.org/favicon.ico',
        url: 'https://teamtrees.org'
      },
      description: 'Help **#TeamTrees** plant 20 million trees around the globe by January 1st, 2020.',
      fields: [
        {
          name: 'Plant trees now, or I\'ll delete your fortnite account!',
          value: '[https://teamtrees.org](https://teamtrees.org)'
        }
      ],
      thumbnail: {
        url: 'https://i.imgur.com/KsOUUDd.png'
      },
      image: {
        url: 'https://i.imgur.com/qKTWB1K.png'
      },
      footer: {
        text: 'Powered by Earth'
      }
    }
  });
};

exports.config = {
  aliases: [ 'trees' ],
  enabled: true
};

exports.help = {
  name: 'teamtrees',
  description: 'Help #TeamTrees plant 20 million trees around the globe by January 1st, 2020!',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'teamtrees',
  example: []
};
