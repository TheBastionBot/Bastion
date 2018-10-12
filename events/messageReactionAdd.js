/**
 * @file messageReactionAdd event
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

let starredMessages = [];

module.exports = async (reaction, user) => {
  try {
    if (!reaction.message.guild) return;


    let guildModel = await user.client.database.models.guild.findOne({
      attributes: [ 'reactionPinning', 'starboard' ],
      where: {
        guildID: reaction.message.guild.id
      },
      include: [
        {
          model: user.client.database.models.textChannel,
          attributes: [ 'channelID', 'ignoreStarboard' ]
        },
        {
          model: user.client.database.models.role,
          attributes: [ 'roleID', 'ignoreStarboard', 'emoji' ]
        },
        {
          model: user.client.database.models.reactionRolesGroup,
          attributes: [ 'messageID', 'channelID', 'guildID', 'reactionRoles', 'mutuallyExclusive' ]
        }
      ]
    });


    if (guildModel) {
      if (guildModel.dataValues.reactionPinning) {
        if ([ '📌', '📍' ].includes(reaction.emoji.name)) {
          if (reaction.message.channel.permissionsFor(user).has('MANAGE_MESSAGES')) {
            if (!reaction.message.pinned) {
              await reaction.message.pin();
            }
          }
        }
      }


      if (guildModel.dataValues.starboard) {
        let isSameUser = reaction.message.author.id === user.id;
        let hasContent = reaction.message.content && reaction.message.content.length;
        let isStarred = [ '🌟', '⭐' ].includes(reaction.emoji.name);
        let alreadyInStarboard = starredMessages.includes(reaction.message.id);

        if (!isSameUser && hasContent && isStarred && !alreadyInStarboard) {
          let starboardIgnoredChannels = guildModel.textChannels.length && guildModel.textChannels.filter(model => model.dataValues.ignoreStarboard).map(model => model.dataValues.channelID);
          let isIgnoredChannel = starboardIgnoredChannels && starboardIgnoredChannels.includes(reaction.message.channel.id);

          if (!isIgnoredChannel) {
            let starboardIgnoredRoles = guildModel.roles.length && guildModel.roles.filter(model => model.dataValues.ignoreStarboard).map(model => model.dataValues.roleID);
            let isIgnoredRole = starboardIgnoredRoles && reaction.message.member.roles.some(role => starboardIgnoredRoles.includes(role.id));

            if (!isIgnoredRole) {
              let image;
              if (reaction.message.attachments.size) {
                if (reaction.message.attachments.first().height) {
                  image = reaction.message.attachments.first().url;
                }
              }

              if (image || reaction.message.content) {
                if (reaction.message.guild.channels.has(guildModel.dataValues.starboard)) {
                  await reaction.message.guild.channels.get(guildModel.dataValues.starboard).send({
                    embed: {
                      color: user.client.colors.GOLD,
                      author: {
                        name: reaction.message.author.tag,
                        icon_url: reaction.message.author.displayAvatarURL
                      },
                      description: reaction.message.content,
                      fields: [
                        {
                          name: 'Channel',
                          value: reaction.message.channel.toString(),
                          inline: true
                        },
                        {
                          name: 'Message ID',
                          value: reaction.message.id,
                          inline: true
                        },
                        {
                          name: 'Link to Message',
                          value: `https://discordapp.com/channels/${reaction.message.guild.id}/${reaction.message.channel.id}/${reaction.message.id}`
                        }
                      ],
                      image: {
                        url: image
                      },
                      timestamp: reaction.message.createdAt
                    }
                  });
                }
                starredMessages.push(reaction.message.id);
              }
            }
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

              await member.addRoles(reactionRoles, 'Self-Assigned via reaction roles.').catch(() => {});

              if (reactionRolesGroupModel.dataValues.mutuallyExclusive) {
                let reactionRolesToBeUnassigned = reactionRoleModels.filter(model => !reactionRoles.includes(model.dataValues.roleID));
                reactionRolesToBeUnassigned = reactionRolesToBeUnassigned.map(model => model.dataValues.roleID);

                await member.removeRoles(reactionRolesToBeUnassigned, 'Auto-Unassigned because of mutually exclusive reaction roles.').catch(() => {});
              }
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
