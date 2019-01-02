/**
 * @file date command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

const location = xrequire('weather-js');

exports.exec = async (Bastion, message, args) => {
  if (!args.length) {
    return Bastion.emit('commandUsage', message, this.help);
  }

  await location.find({ search: args.join(' ') }, async (err, result) => {
    if (err) {
      return Bastion.emit('error', '', Bastion.i18n.error(message.guild.language, 'notFound', 'location'), message.channel);
    }

    if (!result || !result.length) {
      return Bastion.emit('error', '', Bastion.i18n.error(message.guild.language, 'connection'), message.channel);
    }

    let date = Bastion.methods.timezoneOffsetToDate(parseFloat(result[0].location.timezone)).toUTCString();
    date = date.substring(0, date.length - 4);

    await message.channel.send({
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
