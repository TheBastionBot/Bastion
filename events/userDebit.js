/**
 * @file userDebit event
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const SQL = require('sqlite');

module.exports = (user, amount) => {
  SQL.get(`SELECT bastionCurrencies FROM profiles WHERE userID=${user.id}`).then(userProfile => {
    /*
     * If the user doesn't have a profile, create their profile & add Bastion Currencies.
     */
    if (!userProfile) {
      SQL.run('INSERT INTO profiles (userID, bastionCurrencies) VALUES (?, ?)', [ user.id, parseInt(amount) ]).catch(e => {
        user.client.log.error(e.stack);
      });
    }

    /*
     * Add the given amount of Bastion Currencies to the user's account.
     */
    SQL.run(`UPDATE profiles SET bastionCurrencies=${parseInt(userProfile.bastionCurrencies) + parseInt(amount)} WHERE userID=${user.id}`).catch(e => {
      user.client.log.error(e.stack);
    });
  }).catch(e => {
    user.client.log.error(e.stack);
  });
};
