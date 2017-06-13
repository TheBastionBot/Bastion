/**
 * @file date command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const location = require('weather-js');
const timezoneOffsetToDate = require('../../functions/timezoneOffsetToDate.js');

exports.run = (Bastion, message, args) => {
  if (args.length < 1) {
    /**
     * The command was ran with invalid parameters.
     * @fires commandUsage
     */
    return Bastion.emit('commandUsage', message, this.help);
  }

  location.find({ search: args.join(' ') }, function(err, result) {
    if (err) {
      return message.channel.send({
        embed: {
          color: Bastion.colors.red,
          description: `No data found for **${args.join(' ')}**. Please check the location and try again.`
        }
      }).catch(e => {
        Bastion.log.error(e);
      });
    }

    if (!result || result.length < 1) {
      return message.channel.send({
        embed: {
          color: Bastion.colors.red,
          description: 'No data received from the server, please try again later.'
        }
      }).catch(e => {
        Bastion.log.error(e);
      });
    }

    let date = timezoneOffsetToDate(parseFloat(result[0].location.timezone)).toUTCString();
    date = date.substring(0, date.length - 4);

    message.channel.send({
      embed: {
        color: Bastion.colors.blue,
        fields: [
          {
            name: 'Location',
            value: result[0].location.name
          },
          {
            name: 'Date & Time',
            value: date
          }
        ]
      }
    }).catch(e => {
      Bastion.log.error(e);
    });
  });
};

exports.config = {
  aliases: [ 'time' ],
  enabled: true
};

exports.help = {
  name: 'date',
  description: 'Shows the local date and time of any provided region.',
  botPermission: '',
  userPermission: '',
  usage: 'data < location name[, country code] | zip code >',
  example: [ 'date New York, US', 'date 94109' ]
};
