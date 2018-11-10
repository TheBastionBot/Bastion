/**
 * @file credentialsFilter
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

/**
 * Handles filtering of Bastion's credentials contained in messages
 * @param {Message} message Discord.js message object
 * @returns {Promise<boolean>} Whether any credentials was found or not
 */
module.exports = message => {
  return new Promise(async (resolve, reject) => {
    try {
      // Check if any credentials is found in the message
      if (message.content.includes(message.client.token)) resolve(true);
      else return resolve(false);

      // Delete the message if possible to prevent further damage
      if (message.deletable) {
        message.delete().catch(e => {
          message.client.log.error(e);
        });
      }

      // Find the application owner
      let app = await message.client.fetchApplication();
      let owner = await message.client.fetchUser(app.owner.id);

      // Let the application owner know about it
      await owner.send({
        embed: {
          color: message.client.colors.RED,
          title: 'ATTENTION!!',
          description: 'My token has been been exposed! Please regenerate it **ASAP** to prevent my malicious use by others.',
          fields: [
            {
              name: 'Responsible user',
              value: `${message.author.tag} / ${message.author.id}`
            }
          ]
        }
      });
    }
    catch (e) {
      reject(e);
    }
  });
};
