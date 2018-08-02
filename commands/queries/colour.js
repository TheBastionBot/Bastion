/**
 * @file colour command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

const convert = xrequire('color-convert');

exports.exec = (Bastion, message, args) => {
  if (args.color && /^#?[0-9a-f]{6}$/i.test(args.color)) {
    args.color = args.color.replace('#', '');
  }
  else if (args.random) {
    args.color = '000000'.replace(/0/g, () => (~~(Math.random() * 16)).toString(16));
  }
  else {
    /**
     * The command was ran with invalid parameters.
     * @fires commandUsage
     */
    return Bastion.emit('commandUsage', message, this.help);
  }


  message.channel.send({
    embed: {
      color: parseInt(args.color, 16),
      fields: [
        {
          name: 'HEX',
          value: `#${args.color}`,
          inline: true
        },
        {
          name: 'RGB',
          value: `${convert.hex.rgb(args.color)}`,
          inline: true
        },
        {
          name: 'CMYK',
          value: `${convert.hex.cmyk(args.color)}`,
          inline: true
        },
        {
          name: 'HSL',
          value: `${convert.hex.hsl(args.color)}`,
          inline: true
        },
        {
          name: 'HSV',
          value: `${convert.hex.hsv(args.color)}`,
          inline: true
        },
        {
          name: 'HWB',
          value: `${convert.hex.hwb(args.color)}`,
          inline: true
        },
        {
          name: 'LAB',
          value: `${convert.hex.lab(args.color)}`,
          inline: true
        },
        {
          name: 'ANSI16',
          value: `${convert.hex.ansi16(args.color)}`,
          inline: true
        },
        {
          name: 'ANSI256',
          value: `${convert.hex.ansi256(args.color)}`,
          inline: true
        },
        {
          name: 'XYZ',
          value: `${convert.hex.xyz(args.color)}`,
          inline: true
        },
        {
          name: 'HCG',
          value: `${convert.hex.hcg(args.color)}`,
          inline: true
        },
        {
          name: 'Apple',
          value: `${convert.hex.apple(args.color)}`,
          inline: true
        },
        {
          name: 'Gray',
          value: `${convert.hex.gray(args.color)}`,
          inline: true
        },
        {
          name: 'CSS Keyword (Approx.)',
          value: `${convert.hex.keyword(args.color)}`,
          inline: true
        }
      ],
      thumbnail: {
        url: `https://dummyimage.com/250/${args.color}/&text=%20`
      }
    }
  }).catch(e => {
    Bastion.log.error(e);
  });
};

exports.config = {
  aliases: [ 'color' ],
  enabled: true,
  argsDefinitions: [
    { name: 'color', type: String, defaultOption: true },
    { name: 'random', type: Boolean }
  ]
};

exports.help = {
  name: 'colour',
  description: 'Convert the provided color in `HEX` format to `RGB`, `CMYK`, `HSL`, `HSV`, `HWB`, `LAB`, `ANSI16`, `ANSI256`, `XYZ`, `HCG`, `Apple`, `Gray` and `CSS` Keyword (Approximates to closest color) formats.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'colour <#hex-colour-code>',
  example: [ 'colour #dd0000' ]
};
