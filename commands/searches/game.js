/**
 * @file game command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

exports.exec = async (Bastion, message, args) => {
  if (!args.name || !args.name.length) {
    return Bastion.emit('commandUsage', message, this.help);
  }

  args.name = args.name.join(' ');

  let games = await Bastion.methods.makeBWAPIRequest(`/games/search/${args.name}`);
  let game = games[0];

  if (!game) {
    return Bastion.emit('error', '', Bastion.i18n.error(message.guild.language, 'notFound', 'game'), message.channel);
  }

  await message.channel.send({
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
          value: new Date(game.first_release_date * 1000).toDateString(),
          inline: true
        },
        {
          name: 'Links',
          value: game.websites ? game.websites.join('\n') : '-'
        }
      ],
      image: {
        url: game.cover
      },
      footer: {
        text: 'Powered by IGDB'
      }
    }
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
  name: 'game',
  description: 'Searches for the details of a Game.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'game <NAME>',
  example: [ 'game Call of Duty Infinite Warfare', 'game Overwatch' ]
};
