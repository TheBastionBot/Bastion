/**
 * @file directMessageHandler
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

/**
 * Handles direct messages sent to Bastion
 * @param {methods} any methods globally available
 * @param {Message} message Discord.js message object
 * @returns {void}
 */
module.exports = (methods, message) => {
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
  else if (message.content.toLowerCase().startsWith('showspoiler') || message.content.toLowerCase().startsWith('#!showspoiler')) {
    const firstLetterOfMessage = message.content.indexOf('3') + 1;
    const text = message.content.substring(firstLetterOfMessage);
    return message.channel.send({
      embed: {
        color: message.client.colors.BLUE,
        title: 'Here is your decrypted text',
        description: methods.rotThirteen(text.trimLeft())
      }
    }).catch(e => {
      message.client.log.error(e);
    });
  }
  else if (message.content.toLowerCase().startsWith('sendspoiler') || message.content.toLowerCase().startsWith('#!showSpoiler')) {
    const indexOfFirstSpace = message.content.indexOf(' ');
    const indexOfSecondSpace = message.content.indexOf(' ', indexOfFirstSpace + 1);
    const channelId = message.content.substring(indexOfFirstSpace, indexOfSecondSpace).trim();
    const text = message.content.substring(indexOfSecondSpace).trimLeft();
    message.client.channels.get(channelId).send({
      embed: {
        color: message.client.colors.BLUE,
        title: `This message from ${message.author.username} contains spoilers, so we encrypted id`,
        description: 'To decrypt the message, send me a dm with the #!showSpoiler command and the text to decrypt.',
        fields: [
          {
            name: 'Here is the encrypted text',
            value: methods.rotThirteen(text.trimLeft())
          }
        ]
      }
    }).catch(e => {
      message.client.log.error(e);
      return message.channel.send({
        embed: {
          color: message.client.colors.BLUE,
          title: 'There was an error with your input',
          description: 'The correct syntax is #!showSpoiler channelId text'
        }
      });
    });
  }
};
