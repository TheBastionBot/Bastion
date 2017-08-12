/**
 * @file manga command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const string = require('../../handlers/languageHandler');
const Kitsu = require('kitsu.js');
const kitsu = new Kitsu();

exports.run = async (Bastion, message, args) => {
  if (!args.name) {
    /**
     * The command was ran with invalid parameters.
     * @fires commandUsage
     */
    return Bastion.emit('commandUsage', message, this.help);
  }

  let manga = await kitsu.searchManga(args.name);
  manga = manga[0];

  message.channel.send({
    embed: {
      color: Bastion.colors.blue,
      title: manga.titles.en || manga.titles.enJp || manga.titles.canonicalTitle,
      url: `https://kitsu.io/manga/${manga.slug}`,
      description: manga.synopsis,
      fields: [
        {
          name: 'Status',
          value: manga.endDate ? 'Finished' : 'Publishing',
          inline: true
        },
        {
          name: 'Published',
          value: manga.endDate ? `${manga.startDate} - ${manga.endDate}` : `${manga.startDate} - Present`,
          inline: true
        }
      ],
      image: {
        url: manga.posterImage.original
      },
      footer: {
        text: 'Powered by Kitsu'
      }
    }
  }).catch(e => {
    Bastion.log.error(e);
  });
};

exports.config = {
  aliases: [],
  enabled: true,
  argsDefinitions: [
    { name: 'name', type: String, multiple: true, defaultOption: true }
  ]
};

exports.help = {
  name: 'manga',
  description: string('manga', 'commandDescription'),
  botPermission: '',
  userPermission: '',
  usage: 'manga <Manga Name>',
  example: [ 'manga Death Note' ]
};
