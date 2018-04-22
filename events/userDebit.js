/**
 * @file userDebit event
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

module.exports = async (user, amount) => {
  try {
    if (user.guild) {
      user = user.user;
    }

    let userModel = await user.client.database.models.guildMember.findOne({
      attributes: [ 'bastionCurrencies' ],
      where: {
        userID: user.id
      }
    });

    /*
     * If the user doesn't have a profile, create their profile
     * & add Bastion Currencies.
     */
    if (!userModel) {
      return await user.client.database.models.guildMember.create({
        userID: user.id,
        guildID: 'ID', // TODO: Add support for guild ID.
        bastionCurrencies: parseInt(amount)
      },
      {
        fields: [ 'userID', 'guildID', 'bastionCurrencies' ]
      });
    }

    /*
     * Add the given amount of Bastion Currencies to the user's account.
     */
    await user.client.database.models.guildMember.update({
      bastionCurrencies: parseInt(userModel.dataValues.bastionCurrencies) + parseInt(amount)
    },
    {
      where: {
        userID: user.id
      },
      fields: [ 'bastionCurrencies' ]
    });

    /*
     * Add the transaction detail to transactions table.
     */
    await user.client.database.models.transaction.create({
      userID: user.id,
      guildID: 'ID', // TODO: Add support for guild ID.
      type: 'debit',
      amount: parseInt(amount)
    },
    {
      fields: [ 'userID', 'guildID', 'type', 'amount' ]
    });
  }
  catch (e) {
    user.client.log.error(e);
  }
};
