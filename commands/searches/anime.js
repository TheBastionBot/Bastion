/**
 * @file anime command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

exports.exec = async (Bastion, message, args) => {
  if (!args.name) {
    return Bastion.emit('commandUsage', message, this.help);
  }

  let anime = await Bastion.methods.makeBWAPIRequest('/kitsu/anime', {
    qs: {
      name: args.name
    }
  });

  anime = anime[0];

  if (anime) {
    await message.channel.send({
      embed: {
        color: Bastion.colors.BLUE,
        title: Object.values(anime.titles)[0],
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
    });
  }
  else {
    return Bastion.emit('error', '', Bastion.i18n.error(message.guild.language, 'notFound', 'anime'), message.channel);
  }
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
  description: 'Searches for the details of an Anime.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'anime <Anime Name>',
  example: [ 'anime One Piece' ]
};
