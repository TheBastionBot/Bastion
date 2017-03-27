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

const convert = require('color-convert');

exports.run = (Bastion, message, args) => {
  if (!/^#?[0-9a-fA-F]{6}$/.test(args[0])) return;

  message.channel.sendMessage('', {embed: {
    color: 6651610,
    fields: [
      {
        name: 'HEX',
        value: `#${args[0].indexOf('#') != -1 ? args[0].split('#').slice(1).join() : args[0]}`,
        inline: true
      },
      {
        name: 'RGB',
        value: `${convert.hex.rgb(args[0].indexOf('#') != -1 ? args[0].split('#').slice(1).join() : args[0])}`,
        inline: true
      },
      {
        name: 'CMYK',
        value: `${convert.hex.cmyk(args[0].indexOf('#') != -1 ? args[0].split('#').slice(1).join() : args[0])}`,
        inline: true
      },
      {
        name: 'HSL',
        value: `${convert.hex.hsl(args[0].indexOf('#') != -1 ? args[0].split('#').slice(1).join() : args[0])}`,
        inline: true
      },
      {
        name: 'HSV',
        value: `${convert.hex.hsv(args[0].indexOf('#') != -1 ? args[0].split('#').slice(1).join() : args[0])}`,
        inline: true
      },
      {
        name: 'HWB',
        value: `${convert.hex.hwb(args[0].indexOf('#') != -1 ? args[0].split('#').slice(1).join() : args[0])}`,
        inline: true
      },
      {
        name: 'LAB',
        value: `${convert.hex.lab(args[0].indexOf('#') != -1 ? args[0].split('#').slice(1).join() : args[0])}`,
        inline: true
      },
      {
        name: 'ANSI16',
        value: `${convert.hex.ansi16(args[0].indexOf('#') != -1 ? args[0].split('#').slice(1).join() : args[0])}`,
        inline: true
      },
      {
        name: 'ANSI256',
        value: `${convert.hex.ansi256(args[0].indexOf('#') != -1 ? args[0].split('#').slice(1).join() : args[0])}`,
        inline: true
      },
      {
        name: 'XYZ',
        value: `${convert.hex.xyz(args[0].indexOf('#') != -1 ? args[0].split('#').slice(1).join() : args[0])}`,
        inline: true
      },
      {
        name: 'HCG',
        value: `${convert.hex.hcg(args[0].indexOf('#') != -1 ? args[0].split('#').slice(1).join() : args[0])}`,
        inline: true
      },
      {
        name: 'Apple',
        value: `${convert.hex.apple(args[0].indexOf('#') != -1 ? args[0].split('#').slice(1).join() : args[0])}`,
        inline: true
      },
      {
        name: 'Gray',
        value: `${convert.hex.gray(args[0].indexOf('#') != -1 ? args[0].split('#').slice(1).join() : args[0])}`,
        inline: true
      },
      {
        name: 'CSS Keyword (Approx.)',
        value: `${convert.hex.keyword(args[0].indexOf('#') != -1 ? args[0].split('#').slice(1).join() : args[0])}`,
        inline: true
      }
    ],
    thumbnail: {
      url: `https://dummyimage.com/250/${args[0].indexOf('#') != -1 ? args[0].split('#').slice(1).join() : args[0]}/&text=%20`
    }
  }}).catch(e => {
    Bastion.log.error(e.stack);
  });
};

exports.config = {
  aliases: ['colour']
};

exports.help = {
  name: 'color',
  description: 'Convert `HEX` Color to `RGB`, `CMYK`, `HSL`, `HSV`, `HWB`, `LAB`, `ANSI16`, `ANSI256`, `XYZ`, `HCG`, `Apple`, `Gray` and CSS Keyword (Rounds to closest color).',
  permission: '',
  usage: 'color <#hex-color-code>',
  example: ['color #dd0000']
};
