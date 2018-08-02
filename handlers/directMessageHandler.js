/**
 * @file directMessageHandler
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

/**
 * Handles direct messages sent to Bastion
 * @param {Message} message Discord.js message object
 * @returns {void}
 */
module.exports = message => {
  if (!message.content) return;

  if (message.content.toLowerCase().startsWith('help')) {
    return message.channel.send({
      embed: {
        color: message.client.colors.BLUE,
        title: 'The Bastion Bot',
        url: 'https://bastionbot.org',
        description: 'Join [**Bastion HQ**](https://discord.gg/fzx8fkt) to test Bastion and it\'s commands, for giveaway events, for chatting and for a lot of fun!',
        fields: [
          {
            name: 'Bastion HQ Invite Link',
            value: 'https://discord.gg/fzx8fkt'
          },
          {
            name: 'Bastion Bot Invite Link',
            value: `https://discordapp.com/oauth2/authorize?client_id=${message.client.user.id}&scope=bot&permissions=2146958463`
          }
        ],
        thumbnail: {
          url: message.client.user.displayAvatarURL
        },
        footer: {
          text: '</> with ❤ by Sankarsan Kampa (a.k.a. k3rn31p4nic)'
        }
      }
    }).catch(e => {
      message.client.log.error(e);
    });
  }
};
