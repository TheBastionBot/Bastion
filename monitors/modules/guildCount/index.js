/**
 * @file guildCount monitor
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

const postToDiscordBots = require('./postToDiscordBots');

/**
 * Monitors guild count of Bastion
 * @param {TesseractClient} Bastion Tesseract client object
 * @returns {void}
 */
module.exports = async Bastion => {
  if (!Bastion.methods.isPublicBastion(Bastion)) return;

  await postToDiscordBots(Bastion);
};
