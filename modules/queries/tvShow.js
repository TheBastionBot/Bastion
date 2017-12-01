/**
 * @file tvShow command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const request = require('request');

exports.exec = (Bastion, message, args) => {
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
        let tvShow = JSON.parse(body);
        tvShow = tvShow.results[0];

        if (!tvShow) {
          /**
           * Error condition is encountered.
           * @fires error
           */
          return Bastion.emit('error', Bastion.strings.error(message.guild.language, 'notFound'), Bastion.strings.error(message.guild.language, 'notFound', true, 'TV show'), message.channel);
        }

        message.channel.send({
          embed: {
            color: Bastion.colors.BLUE,
            title: tvShow.name,
            url: `https://themoviedb.org/tv/${tvShow.id}`,
            description: tvShow.overview,
            fields: [
              {
                name: 'Language',
                value: tvShow.original_language.toUpperCase(),
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
