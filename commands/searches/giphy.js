/**
 * @file giphy command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

const request = xrequire('request-promise-native');

exports.exec = async (Bastion, message, args) => {
  if (!args.length) {
    return Bastion.emit('commandUsage', message, this.help);
  }

  let options = {
    url: 'http://api.giphy.com/v1/gifs/search',
    qs: {
      q: encodeURI(args.join('+')),
      api_key: 'dc6zaTOxFJmzC',
      limit: 10,
      offset: 0
    },
    json: true
  };

  let response = await request(options);

  if (response.data.length) {
    await message.channel.send({
      embed: {
        color: Bastion.colors.BLUE,
        title: `GIF Search for ${args.join(' ')}`.slice(0, 256),
        image: {
          url: response.data.getRandom().images.original.url
        },
        footer: {
          text: 'Powered by GIPHY'
        }
      }
    });
  }
  else {
    return Bastion.emit('error', '', Bastion.i18n.error(message.guild.language, 'notFound', 'image'), message.channel);
  }
};

exports.config = {
  aliases: [ 'gif' ],
  enabled: true
};

exports.help = {
  name: 'giphy',
  description: 'Searches animated GIFs on the web and sends a random GIF based on the given query.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'giphy <query>',
  example: [ 'giphy iron man' ]
};
