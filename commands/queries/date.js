/**
 * @file date command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

const location = xrequire('weather-js');

exports.exec = (Bastion, message, args) => {
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
      return Bastion.emit('error', '', Bastion.i18n.error(message.guild.language, 'notFound', 'location'), message.channel);
    }

    if (!result || result.length < 1) {
      /**
       * Error condition is encountered.
       * @fires error
       */
      return Bastion.emit('error', '', Bastion.i18n.error(message.guild.language, 'connection'), message.channel);
    }

    let date = Bastion.methods.timezoneOffsetToDate(parseFloat(result[0].location.timezone)).toUTCString();
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
  description: 'Shows the local date and time of any specified city.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'date < location name[, country code] | zip code >',
  example: [ 'date New York, US', 'date 94109' ]
};
