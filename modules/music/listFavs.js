/*
 * Copyright (C) 2017 Sankarsan Kampa
 *                    https://sankarsankampa.com/contact
 *
 * This file is a part of Bastion Discord BOT.
 *                        https://github.com/snkrsnkampa/Bastion
 *
 * This code is licensed under the SNKRSN Shared License. It is free to
 * download, copy, compile, use, study and refer under the terms of the
 * SNKRSN Shared License. You can modify the code only for personal or
 * internal use only. However, you can not redistribute the code without
 * explicitly getting permission fot it.
 *
 * Bastion BOT is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY. See the SNKRSN Shared License for
 * more details.
 *
 * You should have received a copy of the SNKRSN Shared License along
 * with this program. If not, see <https://github.com/snkrsnkampa/Bastion/LICENSE>.
 */

const jsonDB = require('node-json-db');
const db = new jsonDB('./data/favouriteSongs', true, true);

exports.run = (Bastion, message, args) => {
  let songs;
  try {
    db.reload();
    songs = db.getData('/');
  } catch(e) {
    Bastion.log.error(e);
  }
  if (songs.length === 0) {
    return message.channel.send({embed: {
      color: Bastion.colors.red,
      description: 'You haven\'t added any favourite songs yet.'
    }}).catch(e => {
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

  message.channel.send({embed: {
    color: Bastion.colors.dark_grey,
    title: 'Favourite songs',
    description: favs.slice(i * 10, (i * 10) + 10).join('\n'),
    footer: {
      text: `Page: ${i + 1} of ${parseInt(songs.length / 10 + 1)}`
    }
  }}).catch(e => {
    Bastion.log.error(e.stack);
  });
};

exports.config = {
  aliases: []
};

exports.help = {
  name: 'listfavs',
  description: 'Lists the songs in your favourite list.',
  botPermission: '',
  userPermission: '',
  usage: 'listfavs [page_no]',
  example: ['listFavs', 'listFavs 2']
};
