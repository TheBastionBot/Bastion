/**
 * @file race command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const ProgressBar = require('../../utils/progress');

exports.exec = async (Bastion, message) => {
  try {
    let racers = [ [], [] ];
    const STEPS = 20;
    for (let i = 0; i < racers.length; i++) {
      racers[i].length = STEPS;
      for (let j = 0; j < STEPS; j++) {
        racers[i][j] = '-\u2003';
      }
    }

    const bastion = new ProgressBar(':bar', {
      incomplete: '-\u2003',
      complete: '-\u2003',
      head: '\u2003‣\u2003',
      total: 20
    });
    const racer = new ProgressBar(':bar', {
      incomplete: '-\u2003',
      complete: '-\u2003',
      head: '\u2003‣\u2003',
      total: 20
    });

    let raceStatusMessage = await message.channel.send({
      embed: {
        color: Bastion.colors.BLUE,
        title: 'Race',
        fields: [
          {
            name: Bastion.user.tag,
            value: `:vertical_traffic_light: ${racers[0].join('')}:checkered_flag:`
          },
          {
            name: message.author.tag,
            value: `:vertical_traffic_light: ${racers[1].join('')}:checkered_flag:`
          }
        ]
      }
    });

    let timer = setInterval(() => {
      for (let i = 0; i < Math.floor(Math.random() * (5 - 1 + 1) + 1); i++) {
        racer.tick();
      }
      for (let i = 0; i < Math.floor(Math.random() * (5 - 1 + 1) + 1); i++) {
        bastion.tick();
      }

      if (bastion.lastDraw) {
        let result = 'Race ',
          progressBastion = `:vertical_traffic_light: ${bastion.lastDraw}:checkered_flag:`,
          progressRacer = `:vertical_traffic_light: ${racer.lastDraw}:checkered_flag:`;
        if (bastion.complete && !racer.complete) {
          result += 'Ended';
          progressBastion = `:vertical_traffic_light: ${bastion.lastDraw}:checkered_flag: :trophy:`;
        }
        else if (!bastion.complete && racer.complete) {
          result += 'Ended';
          progressRacer = `:vertical_traffic_light: ${racer.lastDraw}:checkered_flag: :trophy:`;
        }
        else if (bastion.complete && racer.complete) {
          result += 'Ended - Draw';
        }
        raceStatusMessage.edit({
          embed: {
            color: Bastion.colors.BLUE,
            title: result,
            fields: [
              {
                name: Bastion.user.tag,
                value: progressBastion
              },
              {
                name: message.author.tag,
                value: progressRacer
              }
            ]
          }
        }).catch(e => {
          Bastion.log.error(e);
        });
      }
      if (bastion.complete || racer.complete) {
        clearInterval(timer);
      }
    }, 1000);
  }
  catch (e) {
    Bastion.log.error(e);
  }
};

exports.config = {
  aliases: [],
  enabled: true
};

exports.help = {
  name: 'race',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'race',
  example: [ 'race' ]
};
