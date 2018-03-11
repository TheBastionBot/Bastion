/**
 * @file patrons command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.exec = async (Bastion, message, args) => {
  try {
    let patrons = await Bastion.functions.getPatrons();
    patrons = patrons.filter(patron => !patron.declined_since).map(patron => patron.full_name);

    let noOfPages = patrons.length / 50;
    let i = (args.page > 0 && args.page < noOfPages + 1) ? args.page : 1;
    i = i - 1;

    let description;
    if (Bastion.user.id === '267035345537728512') {
      description = 'These are the awesome people who continuously support the development of the Bastion bot project, by being my patron, on [Patreon](https://patreon.com/bastionbot).\nIf you want to support the development of Bastion too, [be my Patron](https://patreon.com/bePatron?c=754397)';
    }
    else {
      description = 'These are the awesome people who continuously support us, by being our patron, on Patreon.';
    }

    message.channel.send({
      embed: {
        color: 16345172,
        description: description,
        fields: [
          {
            name: 'Patrons',
            value: patrons.slice(i * 50, (i * 50) + 50).join(', ')
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
