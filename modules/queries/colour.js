/**
 * @file colour command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const convert = require('color-convert');

exports.exec = (Bastion, message, args) => {
  if (!/^#?[0-9a-fA-F]{6}$/.test(args[0])) {
    /**
     * The command was ran with invalid parameters.
     * @fires commandUsage
     */
    return Bastion.emit('commandUsage', message, this.help);
  }

  message.channel.send({
    embed: {
      color: Bastion.colors.BLUE,
      fields: [
        {
          name: 'HEX',
          value: `#${args[0].includes('#') ? args[0].split('#').slice(1).join() : args[0]}`,
          inline: true
        },
        {
          name: 'RGB',
          value: `${convert.hex.rgb(args[0].includes('#') ? args[0].split('#').slice(1).join() : args[0])}`,
          inline: true
        },
        {
          name: 'CMYK',
          value: `${convert.hex.cmyk(args[0].includes('#') ? args[0].split('#').slice(1).join() : args[0])}`,
          inline: true
        },
        {
          name: 'HSL',
          value: `${convert.hex.hsl(args[0].includes('#') ? args[0].split('#').slice(1).join() : args[0])}`,
          inline: true
        },
        {
          name: 'HSV',
          value: `${convert.hex.hsv(args[0].includes('#') ? args[0].split('#').slice(1).join() : args[0])}`,
          inline: true
        },
        {
          name: 'HWB',
          value: `${convert.hex.hwb(args[0].includes('#') ? args[0].split('#').slice(1).join() : args[0])}`,
          inline: true
        },
        {
          name: 'LAB',
          value: `${convert.hex.lab(args[0].includes('#') ? args[0].split('#').slice(1).join() : args[0])}`,
          inline: true
        },
        {
          name: 'ANSI16',
          value: `${convert.hex.ansi16(args[0].includes('#') ? args[0].split('#').slice(1).join() : args[0])}`,
          inline: true
        },
        {
          name: 'ANSI256',
          value: `${convert.hex.ansi256(args[0].includes('#') ? args[0].split('#').slice(1).join() : args[0])}`,
          inline: true
        },
        {
          name: 'XYZ',
          value: `${convert.hex.xyz(args[0].includes('#') ? args[0].split('#').slice(1).join() : args[0])}`,
          inline: true
        },
        {
          name: 'HCG',
          value: `${convert.hex.hcg(args[0].includes('#') ? args[0].split('#').slice(1).join() : args[0])}`,
          inline: true
        },
        {
          name: 'Apple',
          value: `${convert.hex.apple(args[0].includes('#') ? args[0].split('#').slice(1).join() : args[0])}`,
          inline: true
        },
        {
          name: 'Gray',
          value: `${convert.hex.gray(args[0].includes('#') ? args[0].split('#').slice(1).join() : args[0])}`,
          inline: true
        },
        {
          name: 'CSS Keyword (Approx.)',
          value: `${convert.hex.keyword(args[0].includes('#') ? args[0].split('#').slice(1).join() : args[0])}`,
          inline: true
        }
      ],
      thumbnail: {
        url: `https://dummyimage.com/250/${args[0].includes('#') ? args[0].split('#').slice(1).join() : args[0]}/&text=%20`
      }
    }
  }).catch(e => {
    Bastion.log.error(e);
  });
};

exports.config = {
  aliases: [ 'color' ],
  enabled: true
};

exports.help = {
  name: 'colour',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'colour <#hex-colour-code>',
  example: [ 'colour #dd0000' ]
};
