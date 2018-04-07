/**
 * @file changelog command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.exec = (Bastion, message) => {
  const CHANGES = require('../../changes.json');

  let changes = [];
  for (let section in CHANGES) {
    if (CHANGES.hasOwnProperty(section)) {
      if (section === 'date' || section === 'image' || !CHANGES[section].length) continue;

      changes.push({
        name: section,
        value: `- ${CHANGES[section].join('\n- ')}`
      });
    }
  }

  message.channel.send({
    embed: {
      color: Bastion.colors.BLUE,
      title: `Bastion Bot v${Bastion.package.version} Changelog`,
      url: 'https://github.com/TheBastionBot/Bastion/releases',
      description: 'Missed an update? [Check out our previous change logs](https://github.com/TheBastionBot/Bastion/releases)' +
                   '\nJoin our [officia server](https://discord.gg/fzx8fkt) and never miss an update: https://discord.gg/fzx8fkt' +
                   '\n\nSupport the development of Bastion and keep it running forever by [becoming a patron](https://patreon.com/bastionbot) or [donating via PayPal](https://paypal.me/snkrsnkampa)',
      fields: changes,
      image: {
        url: CHANGES.image
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
