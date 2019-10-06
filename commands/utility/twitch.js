/**
 * @file twitch command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

const request = xrequire('request-promise-native');

exports.exec = async (Bastion, message, args) => {
  if (!args.live) {
    return Bastion.emit('commandUsage', message, this.help);
  }

  let options = {
    headers: {
      'Client-ID': Bastion.credentials.twitchClientID,
      'Accept': 'Accept: application/vnd.twitchtv.v5+json'
    },
    url: `https://api.twitch.tv/helix/users/?login=${args.live}`,
    json: true
  };
  let response = await request(options);

  options = {
    headers: {
      'Client-ID': Bastion.credentials.twitchClientID,
      'Accept': 'Accept: application/vnd.twitchtv.v5+json'
    },
    url: `https://api.twitch.tv/kraken/streams/${response.data[0].id}`,
    json: true
  };
  response = await request(options);

  let author, fields, image, footer;

  if (response.stream === null) {
    return Bastion.emit('error', '', Bastion.i18n.error(message.guild.language, 'noLiveStream', args.live), message.channel);
  }

  author = {
    name: response.stream.channel.display_name,
    url: response.stream.channel.url,
    icon_url: response.stream.channel.logo
  };
  fields = [
    {
      name: 'Game',
      value: response.stream.game,
      inline: true
    },
    {
      name: 'Viewers',
      value: response.stream.viewers,
      inline: true
    }
  ];
  image = {
    url: response.stream.preview.large
  };
  footer = {
    text: '🔴 Live'
  };

  await message.channel.send({
    embed: {
      color: Bastion.colors.PURPLE,
      author: author,
      title: response.stream.channel.status,
      url: response.stream.channel.url,
      fields: fields,
      image: image,
      footer: footer,
      timestamp: new Date(response.stream.created_at)
    }
  });
};

exports.config = {
  aliases: [],
  enabled: true,
  argsDefinitions: [
    { name: 'live', type: String, defaultOption: true }
  ]
};

exports.help = {
  name: 'twitch',
  description: 'Get streaming information of a live Twitch channel.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'twitch <username>',
  example: [ 'twitch k3rn31p4nic' ]
};
