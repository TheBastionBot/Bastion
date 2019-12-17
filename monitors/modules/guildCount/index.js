/**
 * @file guildCount monitor
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

const postToDiscordBots = require('./postToDiscordBots');
const postToDiscordBotList = require('./postToDiscordBotList');


/**
 * Runs the specified function repeatedly in the given interval.
 * @param {Function} func The function to run in the interval
 * @param {Number} timeout The time interval
 * @param {TesseractClient} Bastion Tesseract client object
 * @returns {void}
 */
const run = async (func, timeout, Bastion) => {
  await func().catch(() => {});

  Bastion.setTimeout(run, timeout, func, timeout, Bastion);
};

/**
 * Monitors guild count of Bastion
 * @param {TesseractClient} Bastion Tesseract client object
 * @returns {void}
 */
module.exports = Bastion => {
  if (!Bastion.methods.isPublicBastion(Bastion)) return;

  run(postToDiscordBots, 60000, Bastion);
  run(postToDiscordBotList, 60000, Bastion);
};
