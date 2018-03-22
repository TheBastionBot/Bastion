/**
 * @file directMessageHandler
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

/**
 * Handles direct messages sent to Bastion
 * @param {Message} message Discord.js message object
 * @returns {void}
 */
module.exports = message => {
  let prefix = message.client.config.prefix;

  if (message.content.startsWith(prefix)) {
    let args = message.content.split(' ');
    let command = args.shift().slice(prefix.length).toLowerCase();

    if (command === 'help' || command === 'h') {
      return message.channel.send({
        embed: {
          color: message.client.colors.BLUE,
          title: 'Bastion: Discord Bot',
          url: 'https://BastionBot.org',
          description: 'Join [**Bastion: Discord Server**](https://discord.gg/fzx8fkt) to test Bastion and it\'s commands, for giveaway events, for chatting and for a lot of fun!',
          fields: [
            {
              name: 'Bastion: Discord Server Invite Link',
              value: 'https://discord.gg/fzx8fkt'
            },
            {
              name: 'Bastion: Bot Invite Link',
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
  }
};
