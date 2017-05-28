/**
 * @file userDebit event
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const SQL = require('sqlite');

module.exports = (message, user, amount) => {
  SQL.get(`SELECT bastionCurrencies FROM profiles WHERE userID=${user.id}`).then(userProfile => {
    /*
     * If the user doesn't have a profile, yet, we don't allow to add Bastion Currencies to them.
     */
    if (!userProfile) return;

    /*
     * Add the given amount of Bastion Currencies to the user's account.
     */
    SQL.run(`UPDATE profiles SET bastionCurrencies=${parseInt(userProfile.bastionCurrencies) + parseInt(amount)} WHERE userID=${user.id}`).catch(e => {
      message.client.log.error(e.stack);
    });
  }).catch(e => {
    message.client.log.error(e.stack);
  });
};
