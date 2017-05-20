/*
 * Copyright (C) 2017 Sankarsan Kampa
 *                    https://sankarsankampa.com/contact
 *
 * This file is a part of Bastion Discord BOT.
 *                        https://github.com/snkrsnkampa/Bastion
 *
 * This code is licensed under the SNKRSN Shared License. It is free to
 * download, copy, compile, use, study and refer under the terms of the
 * SNKRSN Shared License. You can modify the code only for personal or
 * internal use only. However, you can not redistribute the code without
 * explicitly getting permission fot it.
 *
 * Bastion BOT is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY. See the SNKRSN Shared License for
 * more details.
 *
 * You should have received a copy of the SNKRSN Shared License along
 * with this program. If not, see <https://github.com/snkrsnkampa/Bastion/LICENSE>.
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
