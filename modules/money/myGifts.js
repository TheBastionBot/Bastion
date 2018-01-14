/**
 * @file myGifts command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.exec = async (Bastion, message) => {
  try {
    let gifts = {
      chocolate_bar: [ '🍫  Chocolate Bar', 20 ],
      icecream: [ '🍦  Ice Cream', 10 ],
      cookie: [ '🍪  Cookie', 5 ],
      cake: [ '🍰  Cake', 20 ],
      ring: [ '💍  Ring', 250 ],
      crown: [ '👑  Crown', 500 ],
      gem: [ '💎  Gem', 100 ],
      gift_heart: [ '💝  Heart', 50 ],
      love_letter: [ '💌  Love Letter', 5 ]
    };

    let color, title, description, giftsField = [];
    let userGifts = await Bastion.db.get(`SELECT * FROM gifts WHERE userID='${message.author.id}'`);
    if (!userGifts) {
      color = Bastion.colors.RED;
      title = 'Not Found';
      description = 'Looks like you\'ve not received any gifts yet!\nDon\'t get upset, here\'s a gift from me :gift:';
    }
    else {
      color = Bastion.colors.BLUE;
      title = `Gifts with ${message.author.tag}`;
      for (let gift of Object.keys(gifts)) {
        giftsField.push({
          name: `${gifts[gift][0]}s`,
          value: userGifts[`${gift}s`] || 0,
          inline: true
        });
      }
    }

    message.channel.send({
      embed: {
        color: color,
        title: title,
        description: description,
        fields: giftsField
      }
    }).catch(e => {
      Bastion.log.error(e);
    });
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
  name: 'myGifts',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'myGifts',
  example: []
};
