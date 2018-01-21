/**
 * @file movie command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const request = require('request-promise-native');

exports.exec = async (Bastion, message, args) => {
  try {
    if (!args.movie) {
      /**
       * The command was ran with invalid parameters.
       * @fires commandUsage
       */
      return Bastion.emit('commandUsage', message, this.help);
    }

    let options = {
      method: 'GET',
      url: `https://api.themoviedb.org/3/search/movie?api_key=&query=${encodeURIComponent(args.movie)}`,
      qs: {
        api_key: Bastion.credentials.theMovieDBApiKey
      },
      json: true
    };
    let movie = await request(options);

    movie = movie.results[0];

    if (!movie) {
      /**
       * Error condition is encountered.
       * @fires error
       */
      return Bastion.emit('error', Bastion.strings.error(message.guild.language, 'notFound'), Bastion.strings.error(message.guild.language, 'notFound', true, 'movie'), message.channel);
    }

    // Hard coded genre IDs because they are not likely to change for v3 and dynamically getting them would mean sending another request, since it's a seperate endpoint.
    let genre_list = { '28': 'Action', '12': 'Adventure', '16': 'Animation', '35': 'Comedy', '80': 'Crime', '99': 'Documentary', '18': 'Drama', '10751': 'Family', '14': 'Fantasy', '36': 'History', '27': 'Horror', '10402': 'Music', '9648': 'Mystery', '10749': 'Romance', '878': 'Science Fiction', '10770': 'TV Movie', '53': 'Thriller', '10752': 'War', '37': 'Western' };

    message.channel.send({
      embed: {
        color: Bastion.colors.BLUE,
        title: movie.title,
        url: `https://themoviedb.org/movie/${movie.id}`,
        description: movie.overview,
        fields: [
          {
            name: 'Genre',
            value: movie.genre_ids.map(id => genre_list[id]).join('\n'),
            inline: true
          },
          {
            name: 'Language',
            value: movie.original_language.toUpperCase(),
            inline: true
          },
          {
            name: 'Rating',
            value: `${movie.vote_average}`,
            inline: true
          },
          {
            name: 'Release Date',
            value: movie.release_date,
            inline: true
          }
        ],
        image: {
          url: movie.poster_path ? `https://image.tmdb.org/t/p/original${movie.poster_path}` : `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
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
  aliases: [ 'film' ],
  enabled: true,
  argsDefinitions: [
    { name: 'movie', type: String, multiple: true, defaultOption: true }
  ]
};

exports.help = {
  name: 'movie',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'movie <Movie Name>',
  example: [ 'movie John Wick' ]
};
