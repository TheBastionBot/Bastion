/**
 * @file quotes command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const getRandomInt = require('../../functions/getRandomInt');
const quotes = require('../../data/quotes.json');

exports.run = (Bastion, message, args) => {
  let index = getRandomInt(1, Object.keys(quotes).length);
  if (!isNaN(args[0])) {
    if (args[0] >= 1 && args[0] <= Object.keys(quotes).length) index = args[0];
  }
  else {
    let n = [];
    for (let i = 1; i <= Object.keys(quotes).length; i++) {
      if (quotes[i].author.search(new RegExp(args.join(' '), 'i')) !== -1) {
        n.push(i);
      }
    }
    if (n.length > 0) {
      index = n[Math.floor(Math.random() * n.length)];
      // index = n.random();
    }
  }

  message.channel.send({
    embed: {
      color: Bastion.colors.blue,
      description: `*"${quotes[index].quote}"*\n\n**${quotes[index].author}**`,
      footer: {
        text: `Quote: ${index}`
      }
    }
  }).catch(e => {
    Bastion.log.error(e.stack);
  });
};

exports.config = {
  aliases: [ 'q' ],
  enabled: true
};

exports.help = {
  name: 'quotes',
  description: 'Shows a quote to get you inspired. Search a quote by it\'s index no. or by the author. If none is provided, shows a random quote.',
  botPermission: '',
  userPermission: '',
  usage: 'quotes <number|author>',
  example: [ 'quotes', 'quotes 189', 'quotes Steve Jobs' ]
};
