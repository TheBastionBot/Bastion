/**
 * @file sneakyLinksHandler
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

/**
 * Handles sneaky links sent in messages
 * @param {Message} message Discord.js message object
 * @returns {void}
 */
module.exports = async message => {
  try {
    if (!message.content.length) return;

    let sneakyLinks = await message.client.methods.makeBWAPIRequest(`/text/redirects?text=${message.content}`);

    if (!Object.keys(sneakyLinks).length) return;

    let links = [];
    for (let link in sneakyLinks) {
      if (sneakyLinks.hasOwnProperty(link)) {
        links.push(`${link} ➡ ${sneakyLinks[link]}`);
      }
    }

    await message.channel.send({
      embed: {
        color: message.client.colors.ORANGE,
        title: 'Sneaky Links Found!',
        description: links.join('\n')
      }
    });
  }
  catch (e) {
    message.client.log.error(e);
  }
};
