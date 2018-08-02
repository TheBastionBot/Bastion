/**
 * @file changelog command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

exports.exec = (Bastion, message) => {
  const CHANGES = xrequire('./changes.json');

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

  changes.push(
    {
      name: '\u200B',
      value: '\u200B'
    },
    {
      name: 'Missed an update?',
      value: '[Check out our previous change logs](https://github.com/TheBastionBot/Bastion/releases).'
        + '\nJoin **Bastion HQ** and never miss an update: https://discord.gg/fzx8fkt'
    },
    {
      name: 'Loving Bastion?',
      value: 'Then why wait? Go ahead and express your feelings by tweeting him [@TheBastionBot](https://twitter.com/TheBastionBot) and your testimonial will be posted in [our testimonials page](https://bastionbot.org/testimonials).'
    },
    {
      name: 'Support Bastion\'s Development',
      value: '[Support the development of Bastion](https://bastionbot.org/donate) to keep it running forever and get cool rewards!'
    }
  );

  message.channel.send({
    embed: {
      color: Bastion.colors.BLUE,
      title: `Bastion Bot v${Bastion.package.version} Changelog`,
      url: `https://github.com/TheBastionBot/Bastion/releases/v${Bastion.package.version}`,
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
  description: 'Shows the changes made in the current version of Bastion Bot.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'changelog',
  example: []
};
