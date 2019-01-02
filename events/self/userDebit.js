/**
 * @file userDebit event
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
     * If the user doesn't have a profile, create their profile
     * & add Bastion Currencies.
     */
    if (!guildMemberModel) {
      return await member.client.database.models.guildMember.create({
        userID: member.id,
        guildID: member.guild.id,
        bastionCurrencies: parseInt(amount)
      },
      {
        fields: [ 'userID', 'guildID', 'bastionCurrencies' ]
      });
    }

    /*
     * Add the given amount of Bastion Currencies to the user's account.
     */
    await member.client.database.models.guildMember.update({
      bastionCurrencies: parseInt(guildMemberModel.dataValues.bastionCurrencies) + parseInt(amount)
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
      type: 'debit',
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
