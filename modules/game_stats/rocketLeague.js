/**
 * @file rocketLeague command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const request = require('request-promise-native');

exports.exec = async (Bastion, message, args) => {
  try {
    if (!args.player) {
      /**
      * The command was ran with invalid parameters.
      * @fires commandUsage
      */
      return Bastion.emit('commandUsage', message, this.help);
    }

    // If user doesn't provide the platform, default to Steam
    if (!args.platform) {
      args.platform = 'Steam';
    }
    else {
      let platforms = [ 'steam', 'ps4', 'xboxone' ]; // Available platforms for the game
      // If the platform is not valid, return the available platforms
      if (!platforms.includes(args.platform = args.platform.toLowerCase())) {
        return Bastion.emit('error', Bastion.strings.error(message.guild.language, 'invalidInput'), Bastion.strings.error(message.guild.language, 'invalidPlatform', true, `${platforms.join(', ').toUpperCase()}`), message.channel);
      }
    }

    // eslint-disable-next-line require-jsdoc
    let requestURL = stat_type => `https://api.rocketleague.com/api/v1/${args.platform}/leaderboard/stats/${stat_type}/${args.player}`;
    let endpoints = [
      requestURL('wins'),
      requestURL('goals'),
      requestURL('saves'),
      requestURL('shots'),
      requestURL('mvps'),
      requestURL('assists')
    ];

    let stats = [];
    for (let endpoint of endpoints) {
      let options = {
        url: endpoint,
        headers: {
          'Authorization': `Token ${Bastion.credentials.rocketLeagueUserToken}`,
          'User-Agent': `Bastion/${Bastion.package.version} (${Bastion.user.tag}; ${Bastion.user.id}) https://bastionbot.org`
        },
        json: true
      };

      let stat = await request(options);
      stats.push(stat[0]);
    }

    let fields = stats.map(stat => {
      return {
        name: stat.stat_type.toTitleCase(),
        value: stat.value,
        inline: true
      };
    });

    message.channel.send({
      embed: {
        color: Bastion.colors.BLUE,
        author: {
          name: args.player
        },
        title: `Rocket League Stats - ${args.platform.toUpperCase()}`,
        fields: fields,
        thumbnail: {
          url: 'https://vignette.wikia.nocookie.net/rocketleague/images/2/27/Rocket_League_logo.jpg'
        },
        footer: {
          text: 'Powered by Rocket League'
        }
      }
    }).catch(e => {
      Bastion.log.error(e);
    });
  }
  catch (e) {
    if (e.name === 'StatusCodeError') {
      return Bastion.emit('error', e.statusCode, e.error.message, message.channel);
    }
    Bastion.log.error(e);
  }
};

exports.config = {
  aliases: [],
  enabled: true,
  argsDefinitions: [
    { name: 'player', type: String, defaultOption: true },
    { name: 'platform', type: String, alias: 'p', defaultValue: 'Steam' }
  ]
};

exports.help = {
  name: 'rocketLeague',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'rocketLeague <PLAYER_ID> [ -p <PLATFORM> ]',
  example: [ 'rocketLeague k3rn31p4nic -p XBoxOne' ]
};
