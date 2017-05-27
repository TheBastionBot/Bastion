/**
 * @file userCredit event
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const SQL = require('sqlite');

module.exports = (message, userResolvable, amount) => {
  /*
   * Resolve the user to see if the user is valid.
   */
  let user = message.client.resolver.resolveUser(userResolvable);

  /*
   * If the user is not valid, let it be known.
   */
  if (!user) {
    return message.channel.send({
      embed: {
        color: message.client.colors.red,
        description: 'Can\'t do this operation on an invalid user.'
      }
    }).catch(e => {
      message.client.log.error(e.stack);
    });
  }

  /*
   * Don't allow to deduct less than 1 Bastion Currencies.
   */
  if (amount < 1) {
    return message.channel.send({
      embed: {
        color: message.client.colors.red,
        description: 'Can\'t deduct less than 1 Bastion Currencies.'
      }
    }).catch(e => {
      message.client.log.error(e.stack);
    });
  }

  SQL.get(`SELECT bastionCurrencies FROM profiles WHERE userID=${user.id}`).then(userProfile => {
    /*
     * If the user doesn't have a profile, yet, we don't allow to deduct Bastion Currencies from them.
     */
    if (!userProfile) return;

    /*
     * Deduct the given amount of Bastion Currencies from the user's account.
     * Yes, if they have less Bastion Currencies then the given amount,
     * that will still be deducted from their account.
     */
    SQL.run(`UPDATE profiles SET bastionCurrencies=${parseInt(userProfile.bastionCurrencies) - parseInt(amount)} WHERE userID=${user.id}`).catch(e => {
      message.client.log.error(e.stack);
    });
  }).catch(e => {
    message.client.log.error(e.stack);
  });
};
