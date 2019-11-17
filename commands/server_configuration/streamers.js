/**
 * @file streamers command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

const request = xrequire('request-promise-native');

exports.exec = async (Bastion, message, args) => {
  let options = {
    headers: {
      'Client-ID': Bastion.credentials.twitchClientID,
      'Accept': 'Accept: application/vnd.twitchtv.v5+json'
    },
    json: true
  };

  let streamersModel = await Bastion.database.models.streamers.findOne({
    attributes: [ 'channelID', 'twitch' ],
    where: {
      guildID: message.guild.id
    }
  });

  let twitchStreamers = [], color, title, description;

  if (streamersModel && streamersModel.dataValues.twitch) {
    twitchStreamers = streamersModel.dataValues.twitch;
  }

  if (!args.streamers) {
    if (twitchStreamers.length) {
      color = Bastion.colors.BLUE;
      title = 'Followed streamers';

      let response = await request(`https://api.twitch.tv/helix/users/?id=${twitchStreamers.join('&id=')}`, options);
      description = response.data.map(user => user.display_name).join(', ');
    }
    else {
      color = Bastion.colors.RED;
      description = 'You\'re not following any streamers in this server.';
    }
  }
  else {
    let response = await request(`https://api.twitch.tv/helix/users/?login=${args.streamers.join('&login=')}`, options);

    if (args.remove) {
      color = Bastion.colors.RED;
      title = 'Removed from followed streamers';
      twitchStreamers = twitchStreamers.filter(streamer => response.data.map(user => user.id).indexOf(streamer) < 0);
    }
    else {
      color = Bastion.colors.GREEN;
      title = 'Added to followed streamers';
      twitchStreamers = twitchStreamers.concat(response.data.map(user => user.id));
    }
    description = response.data.map(user => user.display_name).join(' ');
    twitchStreamers = [ ...new Set(twitchStreamers) ];

    await Bastion.database.models.streamers.upsert({
      guildID: message.guild.id,
      channelID: message.channel.id,
      twitch: twitchStreamers
    },
    {
      where: {
        guildID: message.guild.id
      },
      fields: [ 'guildID', 'channelID', 'twitch' ]
    });
  }

  await message.channel.send({
    embed: {
      color: color,
      title: title,
      description: description
    }
  });
};

exports.config = {
  aliases: [],
  enabled: true,
  argsDefinitions: [
    { name: 'streamers', type: String, multiple: true, defaultOption: true },
    { name: 'remove', type: Boolean, alias: 'r' }
  ]
};

exports.help = {
  name: 'streamers',
  description: 'Adds/removes/displays the list of streamers followed by the server to get notified when they are live.',
  botPermission: '',
  userTextPermission: 'MANAGE_GUILD',
  userVoicePermission: '',
  usage: 'streamers [user1 [user2]] [--remove]',
  example: [ 'streamers', 'streamers k3rn31p4nic Wipe Taafe', 'streamers k3rn31p4nic --remove' ]
};
