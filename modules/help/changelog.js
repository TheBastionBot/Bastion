/**
 * @file changelog command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.exec = (Bastion, message) => {
  const CHANGES = require('../../changes.json');
  let changes = [];
  if (CHANGES.fixed.length !== 0) {
    changes.push({
      name: 'THESE BUGS ARE DEAD',
      value: `- ${CHANGES.fixed.join('\n- ')}`
    });
  }
  if (CHANGES.improved.length !== 0) {
    changes.push({
      name: 'THESE ABILITIES HAVE ENHANCED',
      value: `- ${CHANGES.improved.join('\n- ')}`
    });
  }
  if (CHANGES.added.length !== 0) {
    changes.push({
      name: 'NEW FEATURES!',
      value: `- ${CHANGES.added.join('\n- ')}`
    });
  }
  if (CHANGES.removed.length !== 0) {
    changes.push({
      name: 'NOT AVAILABLE ANYMORE',
      value: `- ${CHANGES.removed.join('\n- ')}`
    });
  }
  if (CHANGES.issues.length !== 0) {
    changes.push({
      name: 'BUGS HIDING IN THE CLOSET',
      value: `- ${CHANGES.issues.join('\n- ')}`
    });
  }

  message.channel.send({
    embed: {
      color: Bastion.colors.BLUE,
      title: `Bastion Bot v${Bastion.package.version} Changelog`,
      url: 'https://github.com/TheBastionBot/Bastion/releases',
      description: 'Missed an update? [Check out our previous change logs](https://github.com/TheBastionBot/Bastion/releases)' +
                   '\n\nSupport the development of Bastion and keep it running forever by [becoming a patron](https://patreon.com/snkrsnkampa) or [donating via PayPal](https://paypal.me/snkrsnkampa)',
      fields: changes,
      thumbnail: {
        url: Bastion.user.displayAvatarURL
      },
      footer: {
        text: CHANGES.date
      }
    }
  }).catch(e => {
    Bastion.log.error(e);
  });
};

exports.config = {
  aliases: [ 'clog', 'changes' ],
  enabled: true
};

exports.help = {
  name: 'changelog',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'changelog',
  example: []
};
