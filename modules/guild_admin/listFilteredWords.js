/**
 * @file listFilteredWords command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.run = (Bastion, message, args) => {
  Bastion.db.get(`SELECT filteredWords FROM guildSettings WHERE guildID=${message.guild.id}`).then(row => {
    if (!row || row.filteredWords === '[]') {
      return message.channel.send({
        embed: {
          color: Bastion.colors.red,
          description: 'No words are being filtered.'
        }
      }).catch(e => {
        Bastion.log.error(e.stack);
      });
    }

    let filteredWords = JSON.parse(row.filteredWords);
    filteredWords = [ ...new Set(filteredWords) ];

    filteredWords = filteredWords.map((r, i) => `${i + 1}. ${r}`);
    let i = 0;
    if (isNaN(args = parseInt(args[0]))) {
      i = 1;
    }
    else {
      i = (args > 0 && args < filteredWords.length / 10 + 1) ? args : 1;
    }
    i = i - 1;
    message.channel.send({
      embed: {
        color: Bastion.colors.dark_grey,
        title: 'Filtered Words',
        description: filteredWords.slice(i * 10, (i * 10) + 10).join('\n'),
        footer: {
          text: `Page: ${i + 1} of ${parseInt(filteredWords.length / 10 + 1)}`
        }
      }
    }).catch(e => {
      Bastion.log.error(e.stack);
    });
  }).catch(e => {
    Bastion.log.error(e.stack);
  });
};

exports.config = {
  aliases: [ 'listfw' ],
  enabled: true
};

exports.help = {
  name: 'listfilteredwords',
  description: 'Lists all filtered words.',
  botPermission: '',
  userPermission: '',
  usage: 'listFilteredWords [page_no]',
  example: [ 'listFilteredWords', 'listFilteredWords 2' ]
};
