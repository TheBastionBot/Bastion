/**
 * @file userMissingPermissions event
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

module.exports = permissions => {
  /* eslint-disable no-console*/
  console.log(`User needs ${permissions.replace('_', ' ')} permission to use this command.`);
  /* eslint-enable no-console*/
};
