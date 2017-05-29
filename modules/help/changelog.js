/**
 * @file changeLog command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const CHANGES = require('../../changes.json');

exports.run = (Bastion, message) => {
  let changes = [];
  if (CHANGES.updated.length !== 0) {
    changes.push({
      name: 'Patched/Updated:',
      value: `- ${CHANGES.updated.join('\n- ')}`
    });
  }
  if (CHANGES.added.length !== 0) {
    changes.push({
      name: 'Added:',
      value: `- ${CHANGES.added.join('\n- ')}`
    });
  }
  if (CHANGES.removed.length !== 0) {
    changes.push({
      name: 'Removed:',
      value: `- ${CHANGES.removed.join('\n- ')}`
    });
  }

  message.channel.send({
    embed: {
      color: Bastion.colors.dark_grey,
      title: 'Changelog',
      url: 'https://bastion.js.org/changes',
      description: `Bastion v${Bastion.package.version}`,
      fields: changes,
      thumbnail: {
        url: Bastion.user.displayAvatarURL
      },
      footer: {
        text: CHANGES.date
      }
    }
  }).catch(e => {
    Bastion.log.error(e.stack);
  });
};

exports.config = {
  aliases: [ 'clog', 'changes' ],
  enabled: true
};

exports.help = {
  name: 'changelog',
  description: 'Display changes done in the current version of Bastion Bot.',
  botPermission: '',
  userPermission: '',
  usage: 'changeLog',
  example: []
};
