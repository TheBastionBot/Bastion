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
    /**
     * Error condition is encountered.
     * @fires error
     */
    return Bastion.emit('error', 'Not Found', 'You haven\'t added any favourite songs yet.', message.channel);
  }

  let favs = songs.map((e, i) => `${i + 1}. ${e}`);

  let noOfPages = favs.length / 10;
  let i = (args.page > 0 && args.page < noOfPages + 1) ? args.page : 1;
  i = i - 1;

  message.channel.send({
    embed: {
      color: Bastion.colors.dark_grey,
      title: 'Favourite songs',
      description: favs.slice(i * 10, (i * 10) + 10).join('\n'),
      footer: {
        text: `Page: ${i + 1} of ${noOfPages > parseInt(noOfPages) ? parseInt(noOfPages) + 1 : parseInt(noOfPages)}`
      }
    }
  }).catch(e => {
    Bastion.log.error(e.stack);
  });
};

exports.config = {
  aliases: [],
  enabled: true,
  argsDefinitions: [
    { name: 'page', type: Number, alias: 'p', defaultOption: true, defaultValue: 1 }
  ]
};

exports.help = {
  name: 'listfavs',
  description: 'Lists the songs in your favourite list.',
  botPermission: '',
  userPermission: '',
  usage: 'listfavs [page_no]',
  example: [ 'listFavs', 'listFavs 2' ]
};
