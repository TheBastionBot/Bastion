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
    return message.channel.sendMessage('', {embed: {
      color: Bastion.colors.yellow,
      title: 'Usage',
      description: `\`${Bastion.config.prefix}${this.help.usage}\``
    }}).catch(e => {
      Bastion.log.error(e.stack);
    });
  }
  weather.find({search: args.join(' '), degreeType: 'C'}, function(err, result) {
    if (err) return;

    let fields = [];
    for (let i = 0; i < result[0].forecast.length; i++) {
      fields.push({
        name: new Date(result[0].forecast[i].date).toDateString(),
        value: `**Condition:** ${result[0].forecast[i].skytextday}\n**Low:** ${result[0].forecast[i].low} \u00B0${result[0].location.degreetype}\n**Hign:** ${result[0].forecast[i].high} \u00B0${result[0].location.degreetype}\n**Precipitation:** ${result[0].forecast[i].precip} cm`
      });
    }

    message.channel.sendMessage('', {embed: {
      color: Bastion.colors.blue,
      title: 'Weather Forecast',
      description: result[0].location.name,
      fields: fields,
      footer: {
        text: 'Powered by MSN Weather',
        icon_url: 'https://compass-ssl.microsoft.com/assets/97/01/97013f72-b153-4c69-ab73-a7416cb126b5.png?n=weather-png.png'
      }
    }}).catch(e => {
      Bastion.log.error(e.stack);
    });
  });
};

exports.config = {
  aliases: ['wefc']
};

exports.help = {
  name: 'forecast',
  description: 'Shows weather forecast for 5 days for a specified location by name or ZIP Code.',
  permission: '',
  usage: 'forecast <city [, country_code]|zipcode>',
  example: ['forecast London, UK', 'forecast 94109']
};
