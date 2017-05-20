/*
 * Copyright (C) 2017 Sankarsan Kampa
 *                    https://sankarsankampa.com/contact
 *
 * This file is a part of Bastion Discord BOT.
 *                        https://github.com/snkrsnkampa/Bastion
 *
 * This code is licensed under the SNKRSN Shared License. It is free to
 * download, copy, compile, use, study and refer under the terms of the
 * SNKRSN Shared License. You can modify the code only for personal or
 * internal use only. However, you can not redistribute the code without
 * explicitly getting permission fot it.
 *
 * Bastion BOT is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY. See the SNKRSN Shared License for
 * more details.
 *
 * You should have received a copy of the SNKRSN Shared License along
 * with this program. If not, see <https://github.com/snkrsnkampa/Bastion/LICENSE>.
 */

const weather = require('weather-js');

exports.run = (Bastion, message, args) => {
  if (args.length < 1) {
    return message.channel.send({
      embed: {
        color: Bastion.colors.yellow,
        title: 'Usage',
        description: `\`${Bastion.config.prefix}${this.help.usage}\``
      }
    }).catch(e => {
      Bastion.log.error(e.stack);
    });
  }

  weather.find({ search: args.join(' '), degreeType: 'C' }, function(err, result) {
    if (err) {
      return message.channel.send({
        embed: {
          color: Bastion.colors.red,
          description: `No weather data found for **${args.join(' ')}**. Please check the location and try again. Type \`${Bastion.config.prefix}help weather\` for help on weather command.`
        }
      }).catch(e => {
        Bastion.log.error(e.stack);
      });
    }

    if (!result || result.length < 1) {
      return message.channel.send({
        embed: {
          color: Bastion.colors.red,
          description: 'No weather data received, please try again later.'
        }
      }).catch(e => {
        Bastion.log.error(e.stack);
      });
    }

    message.channel.send({
      embed: {
        color: Bastion.colors.blue,
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
      Bastion.log.error(e.stack);
    });
  });
};

exports.config = {
  aliases: ['we'],
  enabled: true
};

exports.help = {
  name: 'weather',
  description: 'Shows weather information for a specified location by name or ZIP Code.',
  botPermission: '',
  userPermission: '',
  usage: 'weather <city [, country_code]|zipcode>',
  example: ['weather London, UK', 'weather 94109']
};
