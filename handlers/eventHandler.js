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
  /* eslint-disable no-sync */
  let events = fs.readdirSync('./events/').
    filter(file => !fs.statSync(path.resolve('./events/', file)).isDirectory()).
    filter(file => file.endsWith('.js'));
  /* eslint-enable no-sync */

  for (let event of events) {
    event = event.replace(/\.js$/i, '');

    if (event === 'ready') {
      Bastion.on(event, () => xrequire('./events', event)(Bastion));
    }
    else {
      Bastion.on(event, xrequire('./events', event));
    }
  }
};
