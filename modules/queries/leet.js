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

exports.run = function(Bastion, message, args) {
  if (args.length < 1) return;

  args = args.join(' ');
  args = args.replace(/a/ig, '4');
  args = args.replace(/e/ig, '3');
  args = args.replace(/l/ig, '1');
  args = args.replace(/o/ig, '0');
  args = args.replace(/s/ig, '5');
  args = args.replace(/t/ig, '7');

  message.channel.sendMessage('', {embed: {
    color: 6651610,
    title: 'Leet Text',
    description: args
  }}).catch(e => {
    Bastion.log.error(e.stack);
  });
};

exports.conf = {
  aliases: ['1337']
};

exports.help = {
  name: 'leet',
  description: 'Changes a given text to leet text.',
  permission: '',
  usage: ['leet Hello, Everyone!']
};
