/**
 * @file battlefield1 command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

const request = xrequire('request-promise-native');

exports.exec = async (Bastion, message, args) => {
  if (!args.name) {
    return Bastion.emit('commandUsage', message, this.help);
  }

  args.platform = args.platform.toLowerCase();
  if (args.platform === 'xbox') {
    args.platform = 1;
  }
  else if (args.platform === 'ps' || args.platform === 'playstation') {
    args.platform = 2;
  }
  else {
    args.platform = 3;
  }

  let options = {
    headers: {
      'TRN-Api-Key': Bastion.credentials.trackerNetworkAPIKey
    },
    url: `https://battlefieldtracker.com/bf1/api/Stats/BasicStats?platform=${args.platform}&displayName=${args.name}&game=tunguska`,
    json: true
  };
  let response = await request(options);

  await message.channel.send({
    embed: {
      color: Bastion.colors.BLUE,
      title: 'Battlefield 1 - Stats',
      author: {
        name: response.profile.displayName,
        url: response.profile.trackerUrl
      },
      description: `Played ${(response.result.timePlayed / 60 / 60).toFixed(2)} hours`,
      fields: [
        {
          name: 'Rank',
          value: response.result.rank.name,
          inline: true
        },
        {
          name: 'Skill',
          value: `${response.result.skill}`,
          inline: true
        },
        {
          name: 'W/L',
          value: `${(response.result.wins / response.result.losses).toFixed(2)}`,
          inline: true
        },
        {
          name: 'K/D',
          value: `${(response.result.kills / response.result.deaths).toFixed(2)}`,
          inline: true
        },
        {
          name: 'Wins',
          value: `${response.result.wins}`,
          inline: true
        },
        {
          name: 'Losses',
          value: `${response.result.losses}`,
          inline: true
        },
        {
          name: 'Kills',
          value: `${response.result.kills}`,
          inline: true
        },
        {
          name: 'Deaths',
          value: `${response.result.deaths}`,
          inline: true
        },
        {
          name: 'SPM',
          value: `${response.result.spm}`,
          inline: true
        },
        {
          name: 'KPM',
          value: `${response.result.kpm}`,
          inline: true
        }
      ],
      thumbnail: {
        url: response.result.rank.imageUrl.replace('[BB_PREFIX]', response.bbPrefix)
      },
      footer: {
        text: response.profile.platform === 3 ? 'PC' : response.profile.platform === 2 ? 'PlayStation' : 'XBox'
      }
    }
  });
};

exports.config = {
  aliases: [ 'bf1' ],
  enabled: true,
  argsDefinitions: [
    { name: 'name', type: String, alias: 'n', defaultOption: true },
    { name: 'platform', type: String, alias: 'p', defaultValue: 'pc' }
  ]
};

exports.help = {
  name: 'battlefield1',
  description: 'Get stats of any Battlefield 1 player.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'battlefield1 <player_name>',
  example: [ 'battlefield1 VVipe' ]
};
