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
    if (message.content.length <= `${message.client.user}  `.length) return;

    let guildModel = await message.client.database.models.guild.findOne({
      attributes: [ 'chat' ],
      where: {
        guildID: message.guild.id
      }
    });
    if (!guildModel.dataValues.chat) return;

    message.channel.startTyping();

    let options = {
      url: 'https://bastion-cleverbot.glitch.me/api',
      qs: {
        message: message.content.replace(/<@!?[0-9]{1,20}> ?/i, '')
      },
      json: true
    };
    let response = await request(options);

    if (response.status === 'success') {
      message.channel.stopTyping(true);
      await message.channel.send(response.response);
    }
    else {
      message.channel.stopTyping(true);
      await message.channel.send('Beep. Beep. Boop. Boop.');
    }
  }
  catch (e) {
    message.client.log.error(e);
  }
};
