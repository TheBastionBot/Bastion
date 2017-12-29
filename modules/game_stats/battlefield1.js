/**
 * @file battlefield1 command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const request = require('request');

exports.exec = (Bastion, message, args) => {
  if (!args.name) {
    /**
     * The command was ran with invalid parameters.
     * @fires commandUsage
     */
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

  request({
    headers: {
      'TRN-Api-Key': Bastion.credentials.battlefieldAPIKey
    },
    uri: `https://battlefieldtracker.com/bf1/api/Stats/BasicStats?platform=${args.platform}&displayName=${args.name}&game=tunguska`
  }, function (err, response, body) {
    let player, url, color, platform, title = '', description = '', data = [], imageURL = '';

    if (err) {
      /**
       * Error condition is encountered.
       * @fires error
       */
      return Bastion.emit('error', Bastion.strings.error(message.guild.language, 'connection'), Bastion.strings.error(message.guild.language, 'connection', true), message.channel);
    }
    else if (response.statusCode === 200) {
      color = Bastion.colors.BLUE;
      try {
        body = JSON.parse(body);

        title = 'Battlefield 1 - Stats';
        player = body.profile.displayName;
        url = body.profile.trackerUrl;
        description = `Played ${(body.result.timePlayed / 60 / 60).toFixed(2)} hours`;
        imageURL = body.result.rank.imageUrl.replace('[BB_PREFIX]', body.bbPrefix);
        platform = body.profile.platform === 3 ? 'PC' : body.profile.platform === 2 ? 'PlayStation' : 'XBox';
        data = [
          {
            name: 'Rank',
            value: body.result.rank.name,
            inline: true
          },
          {
            name: 'Skill',
            value: `${body.result.skill}`,
            inline: true
          },
          {
            name: 'W/L',
            value: `${(body.result.wins / body.result.losses).toFixed(2)}`,
            inline: true
          },
          {
            name: 'K/D',
            value: `${(body.result.kills / body.result.deaths).toFixed(2)}`,
            inline: true
          },
          {
            name: 'Wins',
            value: `${body.result.wins}`,
            inline: true
          },
          {
            name: 'Losses',
            value: `${body.result.losses}`,
            inline: true
          },
          {
            name: 'Kills',
            value: `${body.result.kills}`,
            inline: true
          },
          {
            name: 'Deaths',
            value: `${body.result.deaths}`,
            inline: true
          },
          {
            name: 'SPM',
            value: `${body.result.spm}`,
            inline: true
          },
          {
            name: 'KPM',
            value: `${body.result.kpm}`,
            inline: true
          }
        ];
      }
      catch (e) {
        /**
         * Error condition is encountered.
         * @fires error
         */
        return Bastion.emit('error', Bastion.strings.error(message.guild.language, 'parseError'), Bastion.strings.error(message.guild.language, 'parse', true), message.channel);
      }
    }
    else {
      /**
       * Error condition is encountered.
       * @fires error
       */
      return Bastion.emit('error', response.statusCode, response.statusMessage, message.channel);
    }

    message.channel.send({
      embed: {
        color: color,
        title: title,
        author: {
          name: player,
          url: url
        },
        description: description,
        fields: data,
        thumbnail: {
          url: imageURL
        },
        footer: {
          text: platform ? `Platform ${platform}` : ''
        }
      }
    }).catch(e => {
      Bastion.log.error(e);
    });
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
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'battlefield1 <player_name>',
  example: [ 'battlefield1 VVipe' ]
};
