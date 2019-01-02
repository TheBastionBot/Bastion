/**
 * @file Event Handler
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

const fs = xrequire('fs');
const path = xrequire('path');

/**
 * Handles/Loads all the events.
 * @module eventHandler
 * @param {object} Bastion The Bastion Object.
 * @returns {void}
 */
module.exports = Bastion => {
  const DISCORD_EVENTS_PATH = './events/discord/';
  const SELF_EVENTS_PATH = './events/self/';

  /* eslint-disable no-sync */
  let DiscordEvents = fs.readdirSync(DISCORD_EVENTS_PATH).
    filter(file => !fs.statSync(path.resolve(DISCORD_EVENTS_PATH, file)).isDirectory()).
    filter(file => file.endsWith('.js'));

  let SelfEvents = fs.readdirSync(SELF_EVENTS_PATH).
    filter(file => !fs.statSync(path.resolve(SELF_EVENTS_PATH, file)).isDirectory()).
    filter(file => file.endsWith('.js'));
  /* eslint-enable no-sync */

  for (let event of DiscordEvents) {
    event = event.replace(/\.js$/i, '');

    if (event === 'ready') {
      Bastion.on(event, () => xrequire(DISCORD_EVENTS_PATH, event)(Bastion));
    }
    else {
      Bastion.on(event, xrequire(DISCORD_EVENTS_PATH, event));
    }
  }

  for (let event of SelfEvents) {
    event = event.replace(/\.js$/i, '');

    Bastion.on(event, xrequire(SELF_EVENTS_PATH, event));
  }
};
