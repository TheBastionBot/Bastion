/**
 * @file sneakyLinks monitor
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

/**
 * Monitors sneaky links sent in messages
 * @param {Message} message Discord.js message object
 * @returns {void}
 */
module.exports = async message => {
  if (!message.guild) return;
  if (message.author.bot) return;
  if (!message.content.length) return;

  let guildModel = await message.client.database.models.guild.findOne({
    attributes: [ 'guildID' ],
    where: {
      guildID: message.guild.id,
      uncoverSneakyLinks: true
    }
  });

  if (!guildModel) return;

  let sneakyLinks = await message.client.methods.makeBWAPIRequest('/text/redirects', {
    qs: {
      text: message.content
    }
  });

  if (!Object.keys(sneakyLinks).length) return;

  let links = [];
  for (let link in sneakyLinks) {
    if (sneakyLinks.hasOwnProperty(link)) {
      links.push(`${link} > ${sneakyLinks[link]}`);
    }
  }

  await message.channel.send({
    embed: {
      color: message.client.colors.ORANGE,
      title: 'Sneaky Links Found!',
      description: links.join('\n'),
      footer: {
        text: `ID: ${message.id}`
      }
    }
  });
};
