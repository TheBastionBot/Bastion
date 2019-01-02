/**
 * @file conversationHandler
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

const request = require('request-promise-native');

/**
 * Handles conversations with Bastion
 * @param {Message} message Discord.js message object
 * @returns {void}
 */
module.exports = async message => {
  try {
    message.content = message.content.replace(/^<@!?[0-9]{1,20}> ?/i, '');

    if (message.content.length < 2) return;

    let guildModel = await message.client.database.models.guild.findOne({
      attributes: [ 'chat' ],
      where: {
        guildID: message.guild.id
      }
    });
    if (!guildModel.dataValues.chat) return;

    message.channel.startTyping();

    let options = {
      url: 'https://bchat.glitch.me/api',
      headers: {
        'User-Agent': 'Bastion Discord Bot (https://bastionbot.org)'
      },
      qs: {
        message: message.content
      },
      json: true
    };
    let response = await request(options);

    message.channel.stopTyping(true);

    if (response.status === 'success') {
      await message.channel.send(response.response);
    }
    else {
      await message.channel.send('Beep. Beep. Boop. Boop.');
    }
  }
  catch (e) {
    message.channel.stopTyping(true);

    message.client.log.error(e);
  }
};
