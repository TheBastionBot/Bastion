/**
 * @file youtubeSearch command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

const yt = xrequire('youtube-dl');

exports.exec = async (Bastion, message, args) => {
  if (!args.length) {
    return Bastion.emit('commandUsage', message, this.help);
  }

  args = `ytsearch:${args.join(' ')}`;
  await yt.getInfo(args, [ '-q', '--skip-download', '--no-warnings', '--format=bestaudio[protocol^=http]' ], async (err, info) => {
    if (err || info.format_id === undefined || info.format_id.startsWith('0')) {
      let errorMessage;
      if (err && err.stack.includes('No video results')) {
        errorMessage = Bastion.i18n.error(message.guild.language, 'notFound', 'video');
      }
      else {
        errorMessage = Bastion.i18n.error(message.guild.language, 'connection');
      }
      return Bastion.emit('error', '', errorMessage, message.channel);
    }

    await message.channel.send({
      embed: {
        color: Bastion.colors.BLUE,
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
    });
  });
};

exports.config = {
  aliases: [ 'ytsearch' ],
  enabled: true
};

exports.help = {
  name: 'youtubeSearch',
  description: 'Searches for a video, for the specified query, on YouTube and shows the first result.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'youtubeSearch <text>',
  example: [ 'youtubeSearch Call of Duty WW2' ]
};
