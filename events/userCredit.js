/**
 * @file userCredit event
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

module.exports = async (member, amount) => {
  try {
    let guildMemberModel = await member.client.database.models.guildMember.findOne({
      attributes: [ 'bastionCurrencies' ],
      where: {
        userID: member.id,
        guildID: member.guild.id
      }
    });

    /*
     * If the user doesn't have a profile, yet, we don't allow
     * to deduct Bastion Currencies from them.
     */
    if (!guildMemberModel) return;

    /*
     * Deduct the given amount of Bastion Currencies from the user's account.
     * Yes, if they have less Bastion Currencies then the given amount,
     * that will still be deducted from their account.
     */
    await member.client.database.models.guildMember.update({
      bastionCurrencies: parseInt(guildMemberModel.dataValues.bastionCurrencies) - parseInt(amount)
    },
    {
      where: {
        userID: member.id,
        guildID: member.guild.id
      },
      fields: [ 'bastionCurrencies' ]
    });

    /*
     * Add the transaction detail to transactions table.
     */
    await member.client.database.models.transaction.create({
      userID: member.id,
      guildID: member.guild.id,
      type: 'credit',
      amount: parseInt(amount)
    },
    {
      fields: [ 'userID', 'guildID', 'type', 'amount' ]
    });
  }
  catch (e) {
    member.client.log.error(e);
  }
};
