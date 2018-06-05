/**
 * @file messageReactionRemove event
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

module.exports = async (reaction, user) => {
  try {
    // TODO: reaction pinning removal logic
  }
  catch (e) {
    user.client.log.error(e);
  }
};
