/**
 * @file slots command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

exports.exec = async (Bastion, message) => {
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
    reels.push(reel.getRandom());
  }

  let result = 'Sorry, you lost.';
  if (reels[0] === reels[1] && reels[1] === reels[2]) {
    result = 'Congrats! You won.';
  }

  await message.channel.send({
    embed: {
      color: Bastion.colors.BLUE,
      title: 'Slot Machine',
      description: reels.join(' \u05C0 '),
      footer: {
        text: `🎰 ${result}`
      }
    }
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
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'slots',
  example: []
};
