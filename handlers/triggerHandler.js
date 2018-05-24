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
  try {
    let triggers = await message.client.db.all('SELECT trigger, response FROM triggers').catch(() => {
      message.client.db.run('CREATE TABLE IF NOT EXISTS triggers (trigger TEXT NOT NULL, response TEXT NOT NULL)');
    });

    if (!Object.keys(triggers).length) return;

    let trigger = '';
    let response = [];
    for (let i = 0; i < triggers.length; i++) {
      if (message.content.toLowerCase() === triggers[i].trigger.toLowerCase()) {
        trigger = triggers[i].trigger;
        response.push(triggers[i].response);
      }
    }

    response = response[Math.floor(Math.random() * response.length)];

    if (response && message.content.toLowerCase() === trigger.toLowerCase()) {
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
  }
  catch (e) {
    message.client.log.error(e);
  }
};
