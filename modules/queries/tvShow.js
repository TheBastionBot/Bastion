/**
 * @file tvShow command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const request = require('request-promise-native');

exports.exec = async (Bastion, message, args) => {
  try {
    if (!args.tvshow) {
      /**
      * The command was ran with invalid parameters.
      * @fires commandUsage
      */
      return Bastion.emit('commandUsage', message, this.help);
    }

    let options = {
      method: 'GET',
      url: `https://api.themoviedb.org/3/search/tv?api_key=&query=${encodeURIComponent(args.tvshow)}`,
      qs: {
        api_key: Bastion.credentials.theMovieDBApiKey
      },
      json: true
    };
    let tvShow = await request(options);

    tvShow = tvShow.results[0];

    if (!tvShow) {
      /**
      * Error condition is encountered.
      * @fires error
      */
      return Bastion.emit('error', Bastion.strings.error(message.guild.language, 'notFound'), Bastion.strings.error(message.guild.language, 'notFound', true, 'TV show'), message.channel);
    }

    // Hard coded genre IDs because they are not likely to change for v3 and dynamically getting them would mean sending another request, since it's a seperate endpoint.
    let genre_list = { '10759': 'Action & Adventure', '16': 'Animation', '35': 'Comedy', '80': 'Crime', '99': 'Documentary', '18': 'Drama', '10751': 'Family', '10762': 'Kids', '9648': 'Mystery', '10763': 'News', '10764': 'Reality', '10765': 'Sci-Fi & Fantasy', '10766': 'Soap', '10767': 'Talk', '10768': 'War & Politics', '37': 'Western' };

    message.channel.send({
      embed: {
        color: Bastion.colors.BLUE,
        title: tvShow.name,
        url: `https://themoviedb.org/tv/${tvShow.id}`,
        description: tvShow.overview,
        fields: [
          {
            name: 'Genre',
            value: tvShow.genre_ids.map(id => genre_list[id]).join('\n'),
            inline: true
          },
          {
            name: 'Language',
            value: tvShow.original_language.toUpperCase(),
            inline: true
          },
          {
            name: 'Rating',
            value: `${tvShow.vote_average}`,
            inline: true
          },
          {
            name: 'First Air Date',
            value: tvShow.first_air_date,
            inline: true
          }
        ],
        image: {
          url: tvShow.poster_path ? `https://image.tmdb.org/t/p/original${tvShow.poster_path}` : `https://image.tmdb.org/t/p/original${tvShow.backdrop_path}`
        },
        footer: {
          text: 'Powered by The Movie Database'
        }
      }
    }).catch(e => {
      Bastion.log.error(e);
    });
  }
  catch (e) {
    if (e.response) {
      return Bastion.emit('error', e.response.statusCode, e.response.statusMessage, message.channel);
    }
    Bastion.log.error(e);
  }
};

exports.config = {
  aliases: [ 'tv' ],
  enabled: true,
  argsDefinitions: [
    { name: 'tvshow', type: String, multiple: true, defaultOption: true }
  ]
};

exports.help = {
  name: 'tvShow',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'tvShow <TV Show Name>',
  example: [ 'tvShow The Flash' ]
};
