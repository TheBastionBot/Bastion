/**
 * @file isBreached command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

exports.exec = async (Bastion, message, args) => {
  try {
    if (!args.name) {
      /**
      * The command was ran with invalid parameters.
      * @fires commandUsage
      */
      return Bastion.emit('commandUsage', message, this.help);
    }

    args.name = args.name.join('');

    let breachedSite = await Bastion.methods.makeBWAPIRequest(`/pwned/site/${args.name}`);

    message.channel.send({
      embed: {
        color: Bastion.colors.BLUE,
        author: {
          name: breachedSite.Title,
          url: `http://${breachedSite.Domain}`
        },
        fields: [
          {
            name: 'Compromised Data',
            value: breachedSite.DataClasses.join(', ')
          },
          {
            name: 'Breach Date',
            value: breachedSite.BreachDate,
            inline: true
          },
          {
            name: 'Verified',
            value: breachedSite.IsVerified,
            inline: true
          }
        ],
        footer: {
          text: 'Powered by Have I been pwned?'
        }
      }
    });
  }
  catch (e) {
    if (e.response) {
      return Bastion.emit('error', e.response.statusCode, e.response.statusCode === 404 ? 'We don\'t have data on any breaches for that site.' : e.response.statusMessage, message.channel);
    }
    Bastion.log.error(e);
  }
};

exports.config = {
  aliases: [ 'isPwned' ],
  enabled: true,
  argsDefinitions: [
    { name: 'name', type: String, multiple: true, defaultOption: true }
  ]
};

exports.help = {
  name: 'isBreached',
  description: 'Check if a site has been breached in the past.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'isBreached <site_name>',
  example: [ 'isBreached Adobe' ]
};
