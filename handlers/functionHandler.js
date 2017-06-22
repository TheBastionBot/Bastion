/**
 * @file Function Handler
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const FS = require('fs');

/**
 * Loads all the functions.
 * @module functionHandler
 * @param {object} Bastion Bastion Discord client object.
 * @returns {void}
 */
module.exports = Bastion => {
  loadFunctions(Bastion);
};

/**
 * Loads all the events.
 * @function loadFunctions
 * @param {object} Bastion The Bastion object.
 * @param {string} module The name of the module.
 * @returns {void}
*/
function loadFunctions(Bastion) {
  FS.readdir('./functions/', (error, files) => {
    if (error) {
      Bastion.log.error(error);
    }
    Bastion.log.info(`Loading ${files.length} functions...`);
    files.forEach(f => {
      let func = f.replace('.js', '');
      Bastion.log.message(`Loading function: ${func}`);
      Bastion.functions[func] = require(`../functions/${f}`);
    });
    Bastion.log.info('Done.');
  });
}
