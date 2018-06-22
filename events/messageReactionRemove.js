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
      },
      include: [
        {
          model: user.client.database.models.role,
          attributes: [ 'roleID', 'emoji' ]
        },
        {
          model: user.client.database.models.reactionRolesGroup,
          attributes: [ 'messageID', 'channelID', 'guildID', 'reactionRoles' ]
        }
      ]
    });

    if (guildModel) {
      if (guildModel.dataValues.reactionPinning) {
        let pins = [ '📌', '📍' ];
        if (pins.includes(reaction.emoji.name)) {
          let authorizedUsers = reaction.users.filter(user => reaction.message.channel.permissionsFor(user).has('MANAGE_MESSAGES'));

          if (authorizedUsers.size === 0 && reaction.message.pinned) {
            await reaction.message.unpin();
          }
        }
      }


      if (guildModel.reactionRolesGroups && guildModel.reactionRolesGroups.length) {
        if (user.id !== user.client.user.id) {
          guildModel.reactionRolesGroups = guildModel.reactionRolesGroups.filter(model => model.dataValues.messageID === reaction.message.id && model.dataValues.channelID === reaction.message.channel.id && model.dataValues.guildID === reaction.message.guild.id);

          if (guildModel.reactionRolesGroups.length) {
            let reactionRolesGroupModel = guildModel.reactionRolesGroups[0];

            let reactionRoleModels = guildModel.roles.filter(model => reactionRolesGroupModel.dataValues.reactionRoles.includes(model.dataValues.roleID));
            let reactionRoleModelsForReaction = reactionRoleModels.filter(model => model.dataValues.emoji === encodeURIComponent(reaction.emoji.name));

            let reactionRoles = reactionRoleModelsForReaction.map(model => model.dataValues.roleID);

            if (reactionRoles.length) {
              let member = await reaction.message.guild.fetchMember(user);

              await member.removeRoles(reactionRoles, 'Self-Unassigned via reaction roles.').catch(() => {});
            }
          }
        }
      }
    }

  }
  catch (e) {
    user.client.log.error(e);
  }
};
