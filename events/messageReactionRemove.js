/**
 * @file messageReactionRemove event
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

module.exports = async (reaction, user) => {
  try {
    if (!reaction.message.guild) return;

    let guildModel = await user.client.database.models.guild.findOne({
      attributes: [ 'reactionPinning' ],
      where: {
        guildID: reaction.message.guild.id
      }
    });

    if (!guildModel) return;

    if (guildModel.dataValues.reactionPinning) {
      let pins = [ '📌', '📍' ];
      if (!pins.includes(reaction.emoji.name)) return;

      let authorizedUsers = reaction.users.filter(user => reaction.message.channel.permissionsFor(user).has('MANAGE_MESSAGES'));

      if (authorizedUsers.size === 0 && reaction.message.pinned) {
        await reaction.message.unpin();
      }
    }
  }
  catch (e) {
    user.client.log.error(e);
  }
};
