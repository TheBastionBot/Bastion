/**
 * @file conversationHandler
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const CLEVERBOT = require('cleverbot-node');
const CREDENTIALS = require('../settings/credentials.json');
const BOT = new CLEVERBOT;
BOT.configure({
  botapi: CREDENTIALS.cleverbotAPIkey
});

/**
 * Handles conversations with Bastion
 * @param {Message} message Discord.js message object
 * @returns {void}
 */
module.exports = message => {
  message.client.db.get(`SELECT chat FROM guildSettings WHERE guildID=${message.guild.id}`).then(guild => {
    if (guild.chat === 'false') return;

    let args = message.content.split(' ');
    if (args.length < 1) return;

    try {
      BOT.write(args.join(' '), function (response) {
        message.channel.startTyping();
        setTimeout(function () {
          message.channel.send(response.output).then(() => {
            message.channel.stopTyping();
          }).catch(e => {
            message.client.log.error(e);
          });
        }, response.output.length * 100);
      });
    }
    catch (e) {
      message.client.log.error(e);
    }
  }).catch(e => {
    message.client.log.error(e);
  });
};
