/**
 * @file youtubeSearch command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const string = require('../../handlers/languageHandler');
const yt = require('youtube-dl');

exports.run = (Bastion, message, args) => {
  if (args.length < 1) {
    /**
     * The command was ran with invalid parameters.
     * @fires commandUsage
     */
    return Bastion.emit('commandUsage', message, this.help);
  }

  args = `ytsearch:${args.join(' ')}`;
  yt.getInfo(args, [ '-q', '--skip-download', '--no-warnings', '--format=bestaudio[protocol^=http]' ], (err, info) => {
    if (err || info.format_id === undefined || info.format_id.startsWith('0')) {
      let error, errorMessage;
      if (err && err.stack.includes('No video results')) {
        error = string('notFound', 'errors');
        errorMessage = `No results found found for **${args.replace('ytsearch:', '')}**.`;
      }
      else {
        error = string('connectionError', 'errors');
        errorMessage = `Some error has occured while finding results for **${args.replace('ytsearch:', '')}**.`;
      }
      /**
       * Error condition is encountered.
       * @fires error
       */
      return Bastion.emit('error', error, errorMessage, message.channel);
    }

    message.channel.send({
      embed: {
        color: Bastion.colors.blue,
        author: {
          name: info.uploader,
          url: info.uploader_url
        },
        title: info.title,
        url: `https://youtu.be/${info.id}`,
        fields: [
          {
            name: 'Likes',
            value: `${info.like_count}`,
            inline: true
          },
          {
            name: 'Dislikes',
            value: `${info.dislike_count}`,
            inline: true
          },
          {
            name: 'Views',
            value: `${info.view_count}`,
            inline: true
          }
        ],
        image: {
          url: info.thumbnail
        },
        footer: {
          text: info.is_live ? 'Live Now' : `Duration: ${info.duration}`
        }
      }
    }).catch(e => {
      Bastion.log.error(e);
    });
  });
};

exports.config = {
  aliases: [ 'ytsearch' ],
  enabled: true
};

exports.help = {
  name: 'youtubesearch',
  description: string('youtubeSearch', 'commandDescription'),
  botPermission: '',
  userPermission: '',
  usage: 'youtubeSearch <text>',
  example: [ 'youtubeSearch Call of Duty WW2' ]
};
