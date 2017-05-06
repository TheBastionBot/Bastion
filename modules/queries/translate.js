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

const translate = require('google-translate-api');

exports.run = (Bastion, message, args) => {
  if (args.length < 2) {
    return message.channel.send({embed: {
      color: Bastion.colors.yellow,
      title: 'Usage',
      description: `\`${Bastion.config.prefix}${this.help.usage}\``
    }}).catch(e => {
      Bastion.log.error(e.stack);
    });
  }
  translate(args.slice(1).join(' '), {to: args[0]}).then(res => {
    message.channel.send({embed: {
      color: Bastion.colors.blue,
      description: res.text,
      footer: {
        text: `Powered by Google | Translation from ${res.from.language.iso.toUpperCase()} to ${args[0].toUpperCase()}`
      }
    }}).catch(e => {
      Bastion.log.error(e.stack);
    });
  }).catch(e => {
    Bastion.log.error(e.stack);
    if (e.stack.includes('not supported')) {
      message.channel.send({embed: {
        color: Bastion.colors.red,
        description: `The language **${args[0].toUpperCase()}** is not supported.`
      }}).catch(e => {
        Bastion.log.error(e.stack);
      });
    }
  });
};

exports.config = {
  aliases: ['trans']
};

exports.help = {
  name: 'translate',
  description: 'Translates your message to a language specified in the arguments by the language code.',
  botPermission: '',
  userPermission: '',
  usage: 'translate <language_code> <text>',
  example: ['translate EN Je suis génial!']
};
