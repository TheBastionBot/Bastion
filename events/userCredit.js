/**
 * @file userCredit event
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

module.exports = async (user, amount) => {
  try {
    let userProfile = await user.client.db.get(`SELECT bastionCurrencies FROM profiles WHERE userID=${user.id}`);

    /*
    * If the user doesn't have a profile, yet, we don't allow
    * to deduct Bastion Currencies from them.
    */
    if (!userProfile) return;

    /*
    * Deduct the given amount of Bastion Currencies from the user's account.
    * Yes, if they have less Bastion Currencies then the given amount,
    * that will still be deducted from their account.
    */
    await user.client.db.run(`UPDATE profiles SET bastionCurrencies=${parseInt(userProfile.bastionCurrencies) - parseInt(amount)} WHERE userID=${user.id}`);

    /*
    * Add the transaction detail to transactions table.
    */
    await user.client.db.run('INSERT INTO transactions (userID, type, amount) VALUES (?, ?, ?)', [ user.id, 'userCredit', parseInt(amount) ]);
  }
  catch (e) {
    user.client.log.error(e);
  }
};
