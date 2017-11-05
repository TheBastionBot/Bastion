/**
 * @file credentialsFilter
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

/**
 * Handles filtering of Bastion's credentials contained in messages
 * @param {Message} message Discord.js message object
 * @returns {void}
 */
module.exports = async message => {
  try {
    /**
    * Filter Discord client token
    */
    if (message.content.includes(message.client.token)) {
      if (message.deletable) {
        message.delete().catch(e => {
          message.client.log.error(e);
        });
      }

      let app = await message.client.fetchApplication();
      let owner = await message.client.fetchUser(app.owner.id);

      owner.send({
        embed: {
          color: message.client.colors.RED,
          title: 'ATTENTION!',
          description: 'My token has been been exposed! Please regenerate it **ASAP** to prevent my malicious use by others.',
          fields: [
            {
              name: 'Responsible user',
              value: `${message.author.tag} - ${message.author.id}`
            }
          ]
        }
      }).catch(e => {
        message.client.log.error(e);
      });
      return true;
    }
  }
  catch (e) {
    message.client.log.error(e);
  }
};
