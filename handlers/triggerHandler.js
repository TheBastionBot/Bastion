/**
 * @file message trigger handler
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

/**
 * Handles triggers in messages and responds with the respective response
 * @param {Message} message Discord.js message object
 * @returns {void}
 */
module.exports = async message => {
  let triggerModels = await message.client.database.models.trigger.findAll({
    attributes: [ 'guildID', 'trigger', 'responseMessage' ]
  });

  if (!triggerModels.length) return;

  let trigger = '';
  let response = [];
  for (let i = 0; i < triggerModels.length; i++) {
    if (message.content.toLowerCase() === triggerModels[i].dataValues.trigger.toLowerCase()) {
      trigger = triggerModels[i].dataValues.trigger;
      response.push(triggerModels[i].dataValues.responseMessage);
    }
  }

  response = response[Math.floor(Math.random() * response.length)];

  if (message.content.toLowerCase() === trigger.toLowerCase()) {
    response = response.replace(/\$user/ig, `<@${message.author.id}>`);
    response = response.replace(/\$username/ig, message.author.username);
    if (message.mentions.users.first()) {
      response = response.replace(/\$mention/ig, message.mentions.users.first());
    }
    else {
      response = response.replace(/\$mention/ig, '');
    }
    response = response.replace(/\$server/ig, `**${message.guild.name}**`);
    response = response.replace(/\$prefix/ig, message.guild.prefix ? message.guild.prefix[0] : message.client.config.prefix );

    return message.channel.send(response).catch(e => {
      message.client.log.error(e);
    });
  }
};
