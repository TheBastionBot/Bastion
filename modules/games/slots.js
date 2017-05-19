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

exports.run = (Bastion, message) => {
  let reel = [
    ':custard:',
    ':candy:',
    ':cake:',
    ':icecream:',
    ':lollipop:',
    ':chocolate_bar:',
    // ':moneybag:',
    ':shaved_ice:',
    ':doughnut:',
    ':cookie:',
    ':ice_cream:'
  ];

  let reels = [];
  for (let i = 0; i < 3; i++) {
    reels.push(reel[Math.floor(Math.random() * reel.length)]);
  }

  let result = 'Sorry, you lost.';
  if (reels[0] === reels[1] && reels[1] === reels[2]) {
    result = 'Congrats! You won.';
  }

  message.channel.send({embed: {
    color: Bastion.colors.blue,
    title: 'Slot Machine',
    description: reels.join(' \u05C0 '),
    footer: {
      text: result
    }
  }}).catch(e => {
    Bastion.log.error(e.stack);
  });
};

exports.config = {
  aliases: [],
  enabled: true
};

exports.help = {
  name: 'slots',
  description: 'Spins the reels of the slot machine and shows you the result.',
  botPermission: '',
  userPermission: '',
  usage: 'slots',
  example: []
};
