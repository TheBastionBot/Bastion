/**
 * @file anime command
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

  let anime = await kitsu.searchAnime(args.name);
  anime = anime[0];

  message.channel.send({
    embed: {
      color: Bastion.colors.BLUE,
      title: anime.titles.english,
      url: `https://kitsu.io/anime/${anime.slug}`,
      description: anime.synopsis,
      fields: [
        {
          name: 'Status',
          value: anime.endDate ? 'Finished' : 'Airing',
          inline: true
        },
        {
          name: 'Aired',
          value: anime.endDate ? `${anime.startDate} - ${anime.endDate}` : `${anime.startDate} - Present`,
          inline: true
        },
        {
          name: 'Rating',
          value: `${anime.ageRating} - ${anime.ageRatingGuide} ${anime.nsfw ? '[NSFW]' : ''}`,
          inline: true
        }
      ],
      image: {
        url: anime.posterImage.original
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
  name: 'anime',
  description: string('anime', 'commandDescription'),
  botPermission: '',
  userPermission: '',
  usage: 'anime <Anime Name>',
  example: [ 'anime One Piece' ]
};
