/**
 * @file steam command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const request = require('request-promise-native');

exports.exec = async (Bastion, message, args) => {
  try {
    if (!args.category) {
      /**
       * The command was ran with invalid parameters.
       * @fires commandUsage
       */
      return Bastion.emit('commandUsage', message, this.help);
    }

    args.category = args.category.join('_').toLowerCase();

    let options = {
      url: 'https://store.steampowered.com/api/featuredcategories/',
      json: true
    };
    let response = await request(options);

    if (!Object.keys(response).includes(args.category)) {
      return Bastion.emit('error', Bastion.strings.error(message.guild.language, 'notFound'), Bastion.strings.error(message.guild.language, 'notFound', true, 'category'), message.channel);
    }

    message.channel.send({
      embed: {
        color: Bastion.colors.BLUE,
        author: {
          name: 'Steam',
          url: 'https://store.steampowered.com'
        },
        title: response[args.category].name,
        description: response[args.category].items.map(item => `[${item.name}](https://store.steampowered.com/app/${item.id})`).join('\n'),
        footer: {
          text: 'Powered by Steam'
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
    { name: 'category', type: String, multiple: true, defaultOption: true }
  ]
};

exports.help = {
  name: 'steam',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'steam [ Specials | Coming Soon | Top Sellers | New Releases ]',
  example: [ 'steam New Releases' ]
};
