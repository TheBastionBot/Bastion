/**
 * @file xkcd command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const xkcd = require('xkcd');

exports.exec = (Bastion, message, args) => {
  if (args.latest) {
    xkcd(function (data) {
      message.channel.send({
        embed: {
          color: Bastion.colors.BLUE,
          title: data.title,
          description: data.alt,
          url: `https://xkcd.com/${data.num}`,
          fields: [
            {
              name: 'Comic Number',
              value: data.num,
              inline: true
            },
            {
              name: 'Publication Date',
              value: new Date(data.year, data.month, data.day).toDateString(),
              inline: true
            }
          ],
          image: {
            url: data.img
          },
          footer: {
            text: 'Powered by xkcd'
          }
        }
      }).catch(e => {
        Bastion.log.error(e);
      });
    });
  }
  else {
    xkcd(function (data) {
      let comicNumber;
      if (args.number && !isNaN(args.number)) {
        comicNumber = args.number > data.num ? data.num : args.number;
      }
      else {
        comicNumber = Bastion.functions.getRandomInt(1, data.num);
      }

      xkcd(comicNumber, function (data) {
        message.channel.send({
          embed: {
            color: Bastion.colors.BLUE,
            title: data.title,
            description: data.alt,
            url: `https://xkcd.com/${data.num}`,
            fields: [
              {
                name: 'Comic Number',
                value: data.num,
                inline: true
              },
              {
                name: 'Publication Date',
                value: new Date(data.year, data.month, data.day).toDateString(),
                inline: true
              }
            ],
            image: {
              url: data.img
            },
            footer: {
              text: 'Powered by xkcd'
            }
          }
        }).catch(e => {
          Bastion.log.error(e);
        });
      });
    });
  }
};

exports.config = {
  aliases: [],
  enabled: true,
  argsDefinitions: [
    { name: 'number', type: Number, alias: 'n' },
    { name: 'latest', type: Boolean, alias: 'l' }
  ]
};

exports.help = {
  name: 'xkcd',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'xkcd [ --latest | -n comic_number ]',
  example: [ 'xkcd', 'xkcd --latest', 'xkcd -n 834' ]
};
