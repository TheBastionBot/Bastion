/**
 * @file guildCount monitor
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

const postToDiscordBots = require('./postToDiscordBots');
const postToDiscordBotList = require('./postToDiscordBotList');

/**
 * Monitors guild count of Bastion
 * @param {TesseractClient} Bastion Tesseract client object
 * @returns {void}
 */
module.exports = Bastion => {
  if (!Bastion.methods.isPublicBastion(Bastion)) return;

  Bastion.setInterval(postToDiscordBots, 5000, Bastion);
  Bastion.setInterval(postToDiscordBotList, 5000, Bastion);
};
