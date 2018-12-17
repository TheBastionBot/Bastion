/**
 * @file steam command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

const request = xrequire('request-promise-native');

exports.exec = async (Bastion, message, args) => {
  if (!args.category) {
    return Bastion.emit('commandUsage', message, this.help);
  }

  args.category = args.category.join('_').toLowerCase();

  let options = {
    url: 'https://store.steampowered.com/api/featuredcategories/',
    json: true
  };
  let response = await request(options);

  if (!Object.keys(response).includes(args.category)) {
    return Bastion.emit('error', '', Bastion.i18n.error(message.guild.language, 'notFound', 'category'), message.channel);
  }

  let games = response[args.category].items.map(item => `[${item.name}](https://store.steampowered.com/app/${item.id})`);

  let noOfPages = games.length / 10;
  let i = (args.page > 0 && args.page < noOfPages + 1) ? args.page : 1;
  i = i - 1;

  await message.channel.send({
    embed: {
      color: Bastion.colors.BLUE,
      author: {
        name: 'Steam',
        url: 'https://store.steampowered.com'
      },
      title: response[args.category].name,
      description: games.slice(i * 10, (i * 10) + 10).join('\n'),
      footer: {
        text: `Page: ${i + 1} of ${noOfPages > parseInt(noOfPages) ? parseInt(noOfPages) + 1 : parseInt(noOfPages)} • Powered by Steam`
      }
    }
  });
};

exports.config = {
  aliases: [],
  enabled: true,
  argsDefinitions: [
    { name: 'category', type: String, multiple: true, defaultOption: true },
    { name: 'page', type: Number, alias: 'p', defaultValue: 1 }
  ]
};

exports.help = {
  name: 'steam',
  description: 'Browse the games in different categories of the Steam Store.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'steam [ Specials | Coming Soon | Top Sellers | New Releases ]',
  example: [ 'steam New Releases' ]
};
