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

exports.run = (Bastion, message, args) => {
  if (args.length < 1) {
    return message.channel.send({
      embed: {
        color: Bastion.colors.yellow,
        title: 'Usage',
        description: `\`${Bastion.config.prefix}${this.help.usage}\``
      }
    }).catch(e => {
      Bastion.log.error(e.stack);
    });
  }

  args = args.join(' ').toLowerCase();
  const tap = '•';
  const sp = ' ';
  const tapCode = {
    'a': tap + sp + tap,
    'b': tap + sp + tap + tap,
    'c': tap + sp + tap + tap + tap,
    'd': tap + sp + tap + tap + tap + tap,
    'e': tap + sp + tap + tap + tap + tap + tap,
    'f': tap + tap + sp + tap,
    'g': tap + tap + sp + tap + tap,
    'h': tap + tap + sp + tap + tap + tap,
    'i': tap + tap + sp + tap + tap + tap + tap,
    'j': tap + tap + sp + tap + tap + tap + tap + tap,
    'k': tap + sp + tap + tap + tap,
    'l': tap + tap + tap + sp + tap,
    'm': tap + tap + tap + sp + tap + tap,
    'n': tap + tap + tap + sp + tap + tap + tap,
    'o': tap + tap + tap + sp + tap + tap + tap + tap,
    'p': tap + tap + tap + sp + tap + tap + tap + tap + tap,
    'q': tap + tap + tap + tap + sp + tap,
    'r': tap + tap + tap + tap + sp + tap + tap,
    's': tap + tap + tap + tap + sp + tap + tap + tap,
    't': tap + tap + tap + tap + sp + tap + tap + tap + tap,
    'u': tap + tap + tap + tap + sp + tap + tap + tap + tap + tap,
    'v': tap + tap + tap + tap + tap + sp + tap,
    'w': tap + tap + tap + tap + tap + sp + tap + tap,
    'x': tap + tap + tap + tap + tap + sp + tap + tap + tap,
    'y': tap + tap + tap + tap + tap + sp + tap + tap + tap + tap,
    'z': tap + tap + tap + tap + tap + sp + tap + tap + tap + tap + tap,
    ' ': '\u2001'
  };
  args = args.replace(/\. /g, ' x ');
  args = args.replace(/./g, x => `${tapCode[x]}\u2001`).trim();

  message.channel.send({
    embed: {
      color: Bastion.colors.blue,
      title: 'Tap Code',
      description: `**${args}**`
    }
  }).catch(e => {
    Bastion.log.error(e.stack);
  });
};

exports.config = {
  aliases: [ 'tap' ],
  enabled: true
};

exports.help = {
  name: 'tapcode',
  description: 'Encodes a given text into Tap Code.',
  botPermission: '',
  userPermission: '',
  usage: 'tapCode <text>',
  example: [ 'tapCode Knock Knock' ]
};
