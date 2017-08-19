/**
 * @file date command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const string = require('../../handlers/languageHandler');
const location = require('weather-js');

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
      /**
       * Error condition is encountered.
       * @fires error
       */
      return Bastion.emit('error', string('notFound', 'errors'), string('notFound', 'errorMessage', 'location'), message.channel);
    }

    if (!result || result.length < 1) {
      /**
       * Error condition is encountered.
       * @fires error
       */
      return Bastion.emit('error', string('connection', 'errors'), string('connection', 'errorMessage'), message.channel);
    }

    let date = Bastion.functions.timezoneOffsetToDate(parseFloat(result[0].location.timezone)).toUTCString();
    date = date.substring(0, date.length - 4);

    message.channel.send({
      embed: {
        color: Bastion.colors.BLUE,
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
  description: string('date', 'commandDescription'),
  botPermission: '',
  userPermission: '',
  usage: 'data < location name[, country code] | zip code >',
  example: [ 'date New York, US', 'date 94109' ]
};
