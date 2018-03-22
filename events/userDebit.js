/**
 * @file userDebit event
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

module.exports = async (user, amount) => {
  try {
    let userProfile = await user.client.db.get(`SELECT bastionCurrencies FROM profiles WHERE userID=${user.id}`);

    /*
    * If the user doesn't have a profile, create their profile
    * & add Bastion Currencies.
    */
    if (!userProfile) {
      return await user.client.db.run('INSERT INTO profiles (userID, bastionCurrencies) VALUES (?, ?)', [ user.id, parseInt(amount) ]);
    }

    /*
    * Add the given amount of Bastion Currencies to the user's account.
    */
    await user.client.db.run(`UPDATE profiles SET bastionCurrencies=${parseInt(userProfile.bastionCurrencies) + parseInt(amount)} WHERE userID=${user.id}`);

    /*
    * Add the transaction detail to transactions table.
    */
    await user.client.db.run('INSERT INTO transactions (userID, type, amount) VALUES (?, ?, ?)', [ user.id, 'userDebit', parseInt(amount) ]);
  }
  catch (e) {
    user.client.log.error(e);
  }
};
