/**
 * @file patrons command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.exec = async (Bastion, message, args) => {
  try {
    let patrons = await Bastion.functions.getPatrons(754397);
    patrons = patrons.map(patron => patron.full_name);

    let noOfPages = patrons.length / 50;
    let i = (args.page > 0 && args.page < noOfPages + 1) ? args.page : 1;
    i = i - 1;

    message.channel.send({
      embed: {
        color: 16345172,
        description: 'These are the awesome people who continuously support the development of the Bastion Bot project by being my patron on [Patreon](https://patreon.com/snkrsnkampa).',
        fields: [
          {
            name: 'Patrons',
            value: patrons.slice(i * 50, (i * 50) + 50).join(', ')
          }
        ],
        footer: {
          text: `Page: ${i + 1} of ${noOfPages > parseInt(noOfPages) ? parseInt(noOfPages) + 1 : parseInt(noOfPages)} • https://patreon.com/snkrsnkampa`
        }
      }
    }).catch(e => {
      Bastion.log.error(e);
    });
  }
  catch (e) {
    if (e.response) {
      if (e.response.body && e.response.body.errors.length) {
        return Bastion.emit('error', `${e.response.statusCode} - ${e.response.statusMessage}`, e.response.body.errors[0].detail, message.channel);
      }
      return Bastion.emit('error', e.response.statusCode, e.response.statusMessage, message.channel);
    }
    Bastion.log.error(e);
  }
};

exports.config = {
  aliases: [],
  enabled: true,
  argsDefinitions: [
    { name: 'page', type: Number, alias: 'p', defaultOption: true, defaultValue: 1 }
  ]
};

exports.help = {
  name: 'patrons',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'patrons',
  example: []
};
