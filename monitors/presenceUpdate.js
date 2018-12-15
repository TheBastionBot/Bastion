/**
 * @file presenceUpdate monitor
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

const gameActivities = require('./modules/gameActivities');

module.exports = async (oldMember, newMember) => {
  try {
    await gameActivities(oldMember, newMember);
  }
  catch (e) {
    newMember.client.log.error(e);
  }
};
