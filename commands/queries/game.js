/**
 * @file game command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

exports.exec = async (Bastion, message, args) => {
  try {
    if (!args.name || !args.name.length) {
      /**
      * The command was ran with invalid parameters.
      * @fires commandUsage
      */
      return Bastion.emit('commandUsage', message, this.help);
    }

    args.name = args.name.join(' ');

    let games = await Bastion.methods.makeBWAPIRequest(`/games/search/${args.name}`);
    let game = games[0];

    if (!game) {
      /**
       * Error condition is encountered.
       * @fires error
       */
      return Bastion.emit('error', '', Bastion.i18n.error(message.guild.language, 'notFound', 'game'), message.channel);
    }

    message.channel.send({
      embed: {
        color: Bastion.colors.BLUE,
        title: game.name,
        url: game.url,
        description: game.summary,
        fields: [
          {
            name: 'Rating',
            value: game.total_rating ? game.total_rating.toFixed(2) : '-',
            inline: true
          },
          {
            name: 'Release Date',
            value: new Date(game.first_release_date).toDateString(),
            inline: true
          },
          {
            name: 'Links',
            value: game.websites ? game.websites.map(website => website.url).join('\n') : '-'
          }
        ],
        image: {
          url: `https://images.igdb.com/igdb/image/upload/t_cover_big/${game.cover.cloudinary_id}.jpg`
        },
        footer: {
          text: 'Powered by IGDB'
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
  aliases: [],
  enabled: true,
  argsDefinitions: [
    { name: 'name', type: String, multiple: true, defaultOption: true }
  ]
};

exports.help = {
  name: 'game',
  description: 'Searches for the details of a Game.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'game <NAME>',
  example: [ 'game Call of Duty Infinite Warfare', 'game Overwatch' ]
};
