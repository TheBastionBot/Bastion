/*
 * Copyright (C) 2017 Sankarsan Kampa
 *                    https://sankarsankampa.com/contact
 *
 * This file is a part of Bastion Discord BOT.
 *                        https://github.com/snkrsnkampa/Bastion
 *
 * This code is licensed under the SNKRSN Shared License. It is free to
 * download, copy, compile, use, study and refer under the terms of the
 * SNKRSN Shared License. You can modify the code only for personal or
 * internal use only. However, you can not redistribute the code without
 * explicitly getting permission fot it.
 *
 * Bastion BOT is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY. See the SNKRSN Shared License for
 * more details.
 *
 * You should have received a copy of the SNKRSN Shared License along
 * with this program. If not, see <https://github.com/snkrsnkampa/Bastion/LICENSE>.
 */

const imdb = require('imdb-api');

exports.run = function(Bastion, message, args) {
  imdb.get(args.join(' '), (err, movie) => {
    if(err) return message.channel.sendMessage('', {embed: {
      color: 13380644,
      description: `No movie or TV series found with the name **${args.join(' ')}**. Please check the name and try again. Type \`${Bastion.config.prefix}help imdb\` for help on imdb command.`
    }}).catch(e => {
      Bastion.log.error(e.stack);
    });
    message.channel.sendMessage('', {embed: {
      color: 6651610,
      title: movie.series ? `${movie.title} (TV Series)` : movie.title,
      url: movie.imdburl,
      description: movie.plot,
      fields: [
        {
          name: 'Genre',
          value: movie.genres,
          inline: true
        },
        {
          name: 'Release',
          value: movie.released.toDateString(),
          inline: true
        },
        {
          name: 'Duration',
          value: movie.runtime,
          inline: true
        },
        {
          name: 'Rated',
          value: movie.rated,
          inline: true
        },
        {
          name: 'Rating',
          value: movie.rating,
          inline: true
        },
        {
          name: 'Votes',
          value: movie.votes,
          inline: true
        },
        {
          name: 'Awards',
          value: movie.awards.split(', ').join('\n'),
          inline: true
        },
        {
          name: 'Starring',
          value: movie.actors.split(', ').join('\n'),
          inline: true
        },
        {
          name: 'Directors',
          value: movie.director.split(', ').join('\n'),
          inline: true
        }
      ],
      image: {
        url: movie.poster
      },
      footer: {
        icon_url: 'https://pbs.twimg.com/profile_images/780796992611942405/qj7ytv9v.jpg',
        text: 'Powered by IMDb'
      }
    }}).catch(e => {
      Bastion.log.error(e.stack);
    });
  });
};

exports.conf = {
  aliases: []
};

exports.help = {
  name: 'imdb',
  description: 'Shows details of a movie or a TV series.',
  permission: '',
  usage: ['imdb Snowden', 'imdb The Blacklist']
};
