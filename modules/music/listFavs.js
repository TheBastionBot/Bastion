/**
 * @file listFavs command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const jsonDB = require('node-json-db');
const db = new jsonDB('./data/favouriteSongs', true, true);

exports.run = (Bastion, message, args) => {
  let songs;
  try {
    db.reload();
    songs = db.getData('/');
  }
  catch(e) {
    Bastion.log.error(e);
  }
  if (songs.length === 0) {
    return message.channel.send({
      embed: {
        color: Bastion.colors.red,
        description: 'You haven\'t added any favourite songs yet.'
      }
    }).catch(e => {
      Bastion.log.error(e.stack);
    });
  }

  let favs = songs.map((e, i) => `${i + 1}. ${e}`);
  let i = 0;
  if (isNaN(args = parseInt(args[0]))) {
    i = 1;
  }
  else {
    i = (args > 0 && args < songs.length / 10 + 1) ? args : 1;
  }
  i = i - 1;

  message.channel.send({
    embed: {
      color: Bastion.colors.dark_grey,
      title: 'Favourite songs',
      description: favs.slice(i * 10, (i * 10) + 10).join('\n'),
      footer: {
        text: `Page: ${i + 1} of ${parseInt(songs.length / 10)}`
      }
    }
  }).catch(e => {
    Bastion.log.error(e.stack);
  });
};

exports.config = {
  aliases: [],
  enabled: true
};

exports.help = {
  name: 'listfavs',
  description: 'Lists the songs in your favourite list.',
  botPermission: '',
  userPermission: '',
  usage: 'listfavs [page_no]',
  example: [ 'listFavs', 'listFavs 2' ]
};
