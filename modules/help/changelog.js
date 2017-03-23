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

const changes = require('../../changes.json');

exports.run = function(Bastion, message, args) {
  message.channel.sendMessage('', {embed: {
    color: 11316394,
    title: 'Changelog',
    description: `Bastion v${Bastion.package.version}`,
    fields: [
      {
        name: 'Patched/Updated:',
        value: `-${changes.updated.join('\n-')}`
      },
      {
        name: 'Added:',
        value: `-${changes.added.join('\n-')}`
      },
      {
        name: 'Removed:',
        value: `-${changes.removed.join('\n-')}`
      }
    ]
  }}).catch(e => {
    Bastion.log.error(e.stack);
  });
};

exports.conf = {
  aliases: ['clog', 'changes']
};

exports.help = {
  name: 'changelog',
  description: 'Display changes done in the current version of Bastion Bot.',
  permission: '',
  usage: 'changeLog',
  example: []
};
