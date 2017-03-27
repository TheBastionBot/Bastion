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

const mathjs = require('mathjs');

exports.run = (Bastion, message, args) => {
  if (args.length < 1) return;

  try {
    message.channel.sendMessage('', {embed: {
      color: 6651610,
      title: 'Result:',
      description: mathjs.eval(args.join(' ')).toFixed(2)
    }});
  } catch(err) {
    message.channel.sendMessage('', {embed: {
      color: 13380644,
      description: 'Invalid mathematical expression!'
    }}).catch(e => {
      Bastion.log.error(e.stack);
    });
  }
};

exports.config = {
  aliases: ['calc']
};

exports.help = {
  name: 'calculate',
  description: 'Evaluates a mathematical expression.',
  permission: '',
  usage: 'calculate <mathematical_expression>',
  example: ['calculate 9 * 10 - 11']
};
