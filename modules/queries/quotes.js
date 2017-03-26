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

const getRandomInt = require('../../functions/getRandomInt');
const quotes = require('../../data/quotes.json');

exports.run = function(Bastion, message, args) {
  let index = getRandomInt(1, Object.keys(quotes).length);
  if (!isNaN(args[0])) {
    if (args[0] >= 1 && args[0] <= Object.keys(quotes).length) index = args[0];
  }
  else {
    let n = [];
    for (var i = 1; i <= Object.keys(quotes).length; i++)
      if (quotes[i].author.search(new RegExp(args.join(' '), 'i')) != -1)
        n.push(i);
    if (n.length > 0) index = n[Math.floor(Math.random()*n.length)];
  }

  message.channel.sendMessage('', {embed: {
    color: 6651610,
    description: `*"${quotes[index].quote}"*\n\n**${quotes[index].author}**`,
    footer: {
      text: `Quote: ${index}`
    }
  }}).catch(e => {
    Bastion.log.error(e.stack);
  });
};

exports.conf = {
  aliases: ['q']
};

exports.help = {
  name: 'quotes',
  description: 'Shows a quote to get you inspired. Search a quote by it\'s index no. or by the author. If none is provided, shows a random quote.',
  permission: '',
  usage: 'quotes <number|author>',
  example: ['quotes', 'quotes 189', 'quotes Steve Jobs']
};
