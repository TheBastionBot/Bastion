/**
 * @file weather command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const weather = require('weather-js');

exports.exec = (Bastion, message, args) => {
  if (args.length < 1) {
    /**
     * The command was ran with invalid parameters.
     * @fires commandUsage
     */
    return Bastion.emit('commandUsage', message, this.help);
  }

  weather.find({ search: args.join(' '), degreeType: 'C' }, function(err, result) {
    if (err) {
      /**
       * Error condition is encountered.
       * @fires error
       */
      return Bastion.emit('error', Bastion.strings.error(message.guild.language, 'notFound'), Bastion.strings.error(message.guild.language, 'weatherNotFound', true), message.channel);
    }

    if (!result || result.length < 1) {
      /**
       * Error condition is encountered.
       * @fires error
       */
      return Bastion.emit('error', Bastion.strings.error(message.guild.language, 'connection'), Bastion.strings.error(message.guild.language, 'connection', true), message.channel);
    }

    message.channel.send({
      embed: {
        color: Bastion.colors.BLUE,
        title: 'Current Weather',
        fields: [
          {
            name: 'Location',
            value: result[0].location.name,
            inline: true
          },
          {
            name: 'Coordinates',
            value: `${result[0].location.lat}, ${result[0].location.long}`,
            inline: true
          },
          {
            name: 'Time Zone',
            value: `UTC${result[0].location.timezone >= 0 ? `+${result[0].location.timezone}` : result[0].location.timezone}`,
            inline: true
          },
          {
            name: 'Condition',
            value: result[0].current.skytext,
            inline: true
          },
          {
            name: 'Temperature',
            value: `${result[0].current.temperature} \u00B0${result[0].location.degreetype}`,
            inline: true
          },
          {
            name: 'Feels Like',
            value: `${result[0].current.feelslike} \u00B0${result[0].location.degreetype}`,
            inline: true
          },
          {
            name: 'Low',
            value: `${result[0].forecast[1].low} \u00B0${result[0].location.degreetype}`,
            inline: true
          },
          {
            name: 'High',
            value: `${result[0].forecast[1].high} \u00B0${result[0].location.degreetype}`,
            inline: true
          },
          {
            name: 'Windspeed',
            value: result[0].current.winddisplay,
            inline: true
          },
          {
            name: 'Humidity',
            value: `${result[0].current.humidity}%`,
            inline: true
          },
          {
            name: 'Precipitation',
            value: `${result[0].forecast[1].precip} cm`,
            inline: true
          },
          {
            name: 'Observation Time',
            value: result[0].current.observationtime,
            inline: true
          }
        ],
        footer: {
          text: 'Powered by MSN Weather'
        }
      }
    }).catch(e => {
      Bastion.log.error(e);
    });
  });
};

exports.config = {
  aliases: [ 'we' ],
  enabled: true
};

exports.help = {
  name: 'weather',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'weather <city [, country_code]|zipcode>',
  example: [ 'weather London, UK', 'weather 94109' ]
};
