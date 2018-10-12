/**
 * @file message trigger handler
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

/**
 * Handles triggers in messages and responds with the respective response
 * @param {Message} message Discord.js message object
 * @returns {void}
 */
module.exports = async message => {
  try {
    let triggerModels = await message.client.database.models.trigger.findAll({
      attributes: [ 'trigger', 'responseMessage', 'responseReactions' ],
      where: {
        guildID: message.guild.id
      }
    });

    if (!triggerModels.length) return;

    let trigger = '';
    let response = [];
    for (let i = 0; i < triggerModels.length; i++) {
      if (message.content.toLowerCase() === triggerModels[i].dataValues.trigger.toLowerCase()) {
        trigger = triggerModels[i].dataValues.trigger;
        response.push({
          message: triggerModels[i].dataValues.responseMessage,
          reaction: triggerModels[i].dataValues.responseReactions
        });
      }
    }

    response = response[Math.floor(Math.random() * response.length)];

    if (response && message.content.toLowerCase() === trigger.toLowerCase()) {
      response.message = JSON.stringify(response.message);
      response.message = message.client.methods.replaceVariables(response.message, message);
      response.message = JSON.parse(response.message);

      if (response.reaction) {
        message.react(response.reaction).catch((e) => {
          message.client.log.error(e);
        });
      }

      if (response.message && Object.keys(response.message).length) {
        let text = response.message.text ? response.message.text : null;

        delete response.message.text;
        let embed = Object.keys(response.message).length ? response.message : null;

        message.channel.send(text, { embed: embed }).catch(e => {
          message.client.log.error(e);

          if (e.code === 50035 && response.message.text) {
            message.channel.send(response.message.text).catch(e => {
              message.client.log.error(e);
            });
          }
        });
      }
    }
  }
  catch (e) {
    message.client.log.error(e);
  }
};
