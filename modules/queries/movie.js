/**
 * @file movie command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const request = require('request');

exports.exec = (Bastion, message, args) => {
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
    body: '{}'
  };

  request(options, (error, response, body) => {
    if (error) {
      /**
       * Error condition is encountered.
       * @fires error
       */
      return Bastion.emit('error', Bastion.strings.error(message.guild.language, 'connection'), Bastion.strings.error(message.guild.language, 'connection', true), message.channel);
    }

    if (response) {
      if (response.statusCode === 200) {
        let movie = JSON.parse(body);
        movie = movie.results[0];

        if (!movie) {
          /**
           * Error condition is encountered.
           * @fires error
           */
          return Bastion.emit('error', Bastion.strings.error(message.guild.language, 'notFound'), Bastion.strings.error(message.guild.language, 'notFound', true, 'movie'), message.channel);
        }

        message.channel.send({
          embed: {
            color: Bastion.colors.BLUE,
            title: movie.title,
            url: `https://themoviedb.org/movie/${movie.id}`,
            description: movie.overview,
            fields: [
              {
                name: 'Language',
                value: movie.original_language.toUpperCase(),
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
      else {
        /**
         * Error condition is encountered.
         * @fires error
         */
        return Bastion.emit('error', response.statusCode, response.statusMessage, message.channel);
      }
    }
  });
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
