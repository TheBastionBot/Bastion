/**
 * @file listFilteredWords command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const string = require('../../handlers/languageHandler');

exports.run = (Bastion, message, args) => {
  Bastion.db.get(`SELECT filteredWords FROM guildSettings WHERE guildID=${message.guild.id}`).then(row => {
    if (!row || row.filteredWords === '[]') {
      /**
       * Error condition is encountered.
       * @fires error
       */
      return Bastion.emit('error', string('notFound', 'errors'), string('notSet', 'errorMessage', 'filtered words'), message.channel);
    }

    let filteredWords = JSON.parse(row.filteredWords);
    filteredWords = [ ...new Set(filteredWords) ];

    filteredWords = filteredWords.map((r, i) => `${i + 1}. ${r}`);

    let noOfPages = filteredWords.length / 10;
    let i = (args.page > 0 && args.page < noOfPages + 1) ? args.page : 1;
    i = i - 1;

    message.channel.send({
      embed: {
        color: Bastion.colors.dark_grey,
        title: 'Filtered Words',
        description: filteredWords.slice(i * 10, (i * 10) + 10).join('\n'),
        footer: {
          text: `Page: ${i + 1} of ${noOfPages > parseInt(noOfPages) ? parseInt(noOfPages) + 1 : parseInt(noOfPages)}`
        }
      }
    }).catch(e => {
      Bastion.log.error(e);
    });
  }).catch(e => {
    Bastion.log.error(e);
  });
};

exports.config = {
  aliases: [ 'listfw' ],
  enabled: true,
  argsDefinitions: [
    { name: 'page', type: Number, alias: 'p', defaultOption: true, defaultValue: 1 }
  ]
};

exports.help = {
  name: 'listfilteredwords',
  description: string('listFilteredWords', 'commandDescription'),
  botPermission: '',
  userPermission: 'ADMINISTRATOR',
  usage: 'listFilteredWords [page_no]',
  example: [ 'listFilteredWords', 'listFilteredWords 2' ]
};
