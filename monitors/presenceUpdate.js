/**
 * @file presenceUpdate monitor
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

const gameActivities = require('./modules/gameActivities');
const songActivities = require('./modules/songActivities');

module.exports = async (oldMember, newMember) => {
  try {
    await gameActivities(oldMember, newMember);
    await songActivities(oldMember, newMember);
  }
  catch (e) {
    newMember.client.log.error(e);
  }
};
