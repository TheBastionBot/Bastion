/**
 * @file The starting point of Bastion
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const FS = require('fs');
const GET_DIR_SYNC = require('../functions/getDirSync');

/**
 * Handles/Loads all the events.
 * @module moduleHandler
 * @param {object} Bastion The Bastion Object.
 * @returns {void}
 */
module.exports = Bastion => {
  let modules = GET_DIR_SYNC('./modules/');
  Bastion.log.info(`Loading ${modules.length} modules...`);
  for (let i = 0; i < modules.length; i++) {
    loadEvent(Bastion, modules[i]);
  }
};

/**
 * Loads all the events.
 * @function loadEvent
 * @param {object} Bastion The Bastion object.
 * @param {string} module The name of the module.
 * @returns {void}
*/
function loadEvent(Bastion, module) {
  FS.readdir(`./modules/${module}/`, (err, files) => {
    if (err) {
      Bastion.log.error(err);
    }
    Bastion.log.info(`Loading module: ${module} [${files.length} commands]`);
    files.forEach(f => {
      let cmd = require(`../modules/${module}/${f}`);
      Bastion.log.message(`Loading command: ${cmd.help.name}`);
      Bastion.commands.set(cmd.help.name, cmd);
      cmd.config.aliases.forEach(alias => {
        Bastion.aliases.set(alias, cmd.help.name);
      });
    });
    Bastion.log.info('Done.');
  });
}
