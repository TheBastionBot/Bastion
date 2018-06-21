/**
 * @file Reaction Roles Groups Handler
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

module.exports = async Bastion => {
  try {
    let reactionRolesGroupModels = await Bastion.database.models.reactionRolesGroup.findAll({
      attributes: [ 'messageID', 'channelID', 'guildID' ]
    });

    let reactionRolesGroups = reactionRolesGroupModels.map(model => model.dataValues);

    for (let group of reactionRolesGroups) {
      if (!Bastion.channels.has(group.channelID)) return;
      let channel = Bastion.channels.get(group.channelID);
      if (!channel.messages.has(group.messageID)) {
        await channel.fetchMessage(group.messageID);
      }
    }
  }
  catch (e) {
    Bastion.error.log(e);
  }
};
