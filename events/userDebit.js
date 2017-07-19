/**
 * @file userDebit event
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

module.exports = (user, amount) => {
  user.client.db.get(`SELECT bastionCurrencies FROM profiles WHERE userID=${user.id}`).then(userProfile => {
    /*
     * If the user doesn't have a profile, create their profile & add Bastion Currencies.
     */
    if (!userProfile) {
      user.client.db.run('INSERT INTO profiles (userID, bastionCurrencies) VALUES (?, ?)', [ user.id, parseInt(amount) ]).catch(e => {
        user.client.log.error(e);
      });
    }
    else {
      /*
      * Add the given amount of Bastion Currencies to the user's account.
      */
      user.client.db.run(`UPDATE profiles SET bastionCurrencies=${parseInt(userProfile.bastionCurrencies) + parseInt(amount)} WHERE userID=${user.id}`).then(() => {
        user.client.db.run('INSERT INTO transactions (userID, type, amount) VALUES (?, ?, ?)', [ user.id, 'userDebit', amount ]).catch(e => {
          user.client.log.error(e);
        });
      }).catch(e => {
        user.client.log.error(e);
      });
    }
  }).catch(e => {
    user.client.log.error(e);
  });
};
