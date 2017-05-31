/**
 * @file xkcd command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const xkcd = require('xkcd');
const getRandomInt = require('../../functions/getRandomInt');

exports.run = (Bastion, message, args) => {
  let num = parseInt(args[0]);
  if (args[0] !== undefined && !isNaN(num)) {
    xkcd(function (data) {
      xkcd(num > data.num ? data.num : num, function (data) {
        message.channel.send({
          embed: {
            color: Bastion.colors.blue,
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
          Bastion.log.error(e.stack);
        });
      });
    });
  }
  else if (args[0] !== undefined && args[0].toLowerCase() === 'latest') {
    xkcd(function (data) {
      message.channel.send({
        embed: {
          color: Bastion.colors.blue,
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
        Bastion.log.error(e.stack);
      });
    });
  }
  else {
    xkcd(function (data) {
      let num = getRandomInt(1, data.num);
      xkcd(num, function (data) {
        message.channel.send({
          embed: {
            color: Bastion.colors.blue,
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
          Bastion.log.error(e.stack);
        });
      });
    });
  }
};

exports.config = {
  aliases: [],
  enabled: true
};

exports.help = {
  name: 'xkcd',
  description: 'Shows a **xkcd** comic. No arguments will shows a random comic. If a comic number is given, it will show that specific comic & \'latest\' will show the latest comic.',
  botPermission: '',
  userPermission: '',
  usage: 'xkcd [ latest | comic_number ]',
  example: [ 'xkcd', 'xkcd latest', 'xkcd 834' ]
};
