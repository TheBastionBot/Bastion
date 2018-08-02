/**
 * @file conversationHandler
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

const CLEVERBOT = xrequire('cleverbot.js');
const CREDENTIALS = xrequire('./settings/credentials.json');
const BOT = new CLEVERBOT({
  APIKey: CREDENTIALS.cleverbotAPIkey
});

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

    let response = await BOT.write(message.content);
    if (response.output) {
      message.channel.startTyping();
      setTimeout(async () => {
        try {
          message.channel.stopTyping(true);
          await message.channel.send(response.output);
        }
        catch (e) {
          message.client.log.error(e);
        }
      }, response.output.length * 100);
    }
  }
  catch (e) {
    message.client.log.error(e);
  }
};
