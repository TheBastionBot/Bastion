/**
 * @file patrons command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.exec = async (Bastion, message, args) => {
  try {
    let patrons = await Bastion.functions.getPatrons(754397);
    patrons = patrons.map(patron => patron.full_name).map((r, i) => `${i + 1}. ${r}`);

    let noOfPages = patrons.length / 10;
    let i = (args.page > 0 && args.page < noOfPages + 1) ? args.page : 1;
    i = i - 1;

    message.channel.send({
      embed: {
        color: 16345172,
        title: 'Patrons',
        description: 'These are the awesome people who support the development of the Bastion Bot project, on [Patreon](https://patreon.com/snkrsnkampa).',
        fields: [
          {
            name: 'Patrons',
            value: patrons.slice(i * 10, (i * 10) + 10).join('\n')
          },
          {
            name: 'Be my Patron',
            value: 'If you want to support the development of the Bastion Bot project, and receive amazing rewards, please head over to my Patreon page: https://patreon.com/snkrsnkampa'
          }
        ],
        footer: {
          text: `Page: ${i + 1} of ${noOfPages > parseInt(noOfPages) ? parseInt(noOfPages) + 1 : parseInt(noOfPages)}`
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
