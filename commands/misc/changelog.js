/**
 * @file changelog command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

exports.exec = async (Bastion, message) => {
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
      name: 'Support Bastion\'s Development',
      value: '[Support the development of Bastion](https://bastion.traction.one/donate) to keep it running forever and get cool rewards!'
    }
  );

  await message.channel.send({
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
