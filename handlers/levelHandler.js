/**
 * @file levelHandler
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

const levelUpMessages = xrequire('./assets/levelUpMessages.json');

/**
 * Handles user's experience points and levels
 * @param {Message} message Discord.js message object
 * @returns {void}
 */
module.exports = async message => {
  try {
    /**
     * Using <Model>.findOrCreate() won't require the use of
     * <ModelInstance>.save() but <Model>.findOrBuild() is used instead because
     * <Model>.findOrCreate() creates a race condition where a matching row is
     * created by another connection after the `find` but before the `insert`
     * call. However, it is not always possible to handle this case in SQLite,
     * specifically if one transaction inserts and another tries to select
     * before the first one has committed. TimeoutError is thrown instead.
     */
    let [ guildMemberModel, initialized ] = await message.client.database.models.guildMember.findOrBuild({
      where: {
        userID: message.author.id,
        guildID: message.guild.id
      },
      defaults: {
        experiencePoints: 0
      }
    });
    if (initialized) {
      await guildMemberModel.save();
    }

    let guildModel = await message.client.database.models.guild.findOne({
      attributes: [ 'levelUpMessages', 'levelUps' ],
      where: {
        guildID: message.guild.id
      },
      include: [
        {
          model: message.client.database.models.textChannel,
          attributes: [ 'channelID', 'ignoreXP' ]
        },
        {
          model: message.client.database.models.role,
          attributes: [ 'roleID', 'level', 'exclusive', 'ignoreXP' ]
        }
      ]
    });


    let experienceIgnoredChannels = guildModel.textChannels.length && guildModel.textChannels.filter(model => model.dataValues.ignoreXP).map(model => model.dataValues.channelID);
    let isIgnoredChannel = experienceIgnoredChannels && experienceIgnoredChannels.includes(message.channel.id);

    if (isIgnoredChannel) return;

    let experienceIgnoredRoles = guildModel.roles.length && guildModel.roles.filter(model => model.dataValues.ignoreXP).map(model => model.dataValues.roleID);
    let hasIgnoredRole = experienceIgnoredRoles && message.member.roles.some(role => experienceIgnoredRoles.includes(role.id));

    if (hasIgnoredRole) return;


    guildMemberModel.dataValues.experiencePoints = parseInt(guildMemberModel.dataValues.experiencePoints);
    guildMemberModel.dataValues.level = parseInt(guildMemberModel.dataValues.level);
    guildMemberModel.dataValues.bastionCurrencies = parseInt(guildMemberModel.dataValues.bastionCurrencies);

    let currentLevel = Math.floor(0.15 * Math.sqrt(guildMemberModel.dataValues.experiencePoints + 1));


    // Level Up
    if (guildModel.dataValues.levelUps && guildMemberModel.dataValues.experiencePoints < 44444444444444) {
      if (currentLevel > guildMemberModel.dataValues.level) {
        await message.client.database.models.guildMember.update({
          bastionCurrencies: guildMemberModel.dataValues.bastionCurrencies + currentLevel * 5,
          experiencePoints: guildMemberModel.dataValues.experiencePoints + 1,
          level: currentLevel
        },
        {
          where: {
            userID: message.author.id,
            guildID: message.guild.id
          },
          fields: [ 'bastionCurrencies', 'experiencePoints', 'level' ]
        });

        if (guildModel.dataValues.levelUpMessages) {
          let levelUpMessage = levelUpMessages[Math.floor(Math.random() * levelUpMessages.length)];

          message.channel.send({
            embed: {
              color: message.client.colors.BLUE,
              title: 'LEVELED UP!',
              description: levelUpMessage,
              thumbnail: {
                url: `https://dummyimage.com/250/40C4FB/&text=${currentLevel}`
              },
              fields: [
                {
                  name: `${message.author.tag} leveled up to Level ${currentLevel}`,
                  value: '\u200B'
                }
              ]
            }
          }).then(msg => {
            msg.delete(90000).catch(() => {});
          }).catch(e => {
            message.client.log.error(e);
          });
        }
      }
      else {
        await message.client.database.models.guildMember.update({
          experiencePoints: guildMemberModel.dataValues.experiencePoints + 1
        },
        {
          where: {
            userID: message.author.id,
            guildID: message.guild.id
          },
          fields: [ 'experiencePoints' ]
        });
      }
    }


    // Level up roles
    let levelUpRoles = guildModel.roles.filter(role => role.dataValues.level).map(role => role.dataValues);

    let levelUpRoleIDs = {};
    let exclusiveLevels = [];
    for (let role of levelUpRoles) {
      if (!levelUpRoleIDs.hasOwnProperty(role.level)) {
        levelUpRoleIDs[role.level] = [];
      }

      levelUpRoleIDs[role.level].push(role.roleID);

      if (role.exclusive) {
        if (!exclusiveLevels.includes(role.level)) {
          exclusiveLevels.push(role.level);
        }
      }
    }

    let level = `${currentLevel}`;
    if (levelUpRoleIDs.hasOwnProperty(level)) {
      if (exclusiveLevels.includes(level)) {
        let allLevelUpRoles = Object.values(levelUpRoleIDs).flatten().filter(role => !levelUpRoleIDs[level].includes(role));
        await message.member.removeRoles(allLevelUpRoles, 'Level Up').catch(() => {});

        /**
         * HACK: When adding roles instantly after removing then just above this,
         * a race condition occurs which adds the old roles back to the member as
         * the cache hasn't been updated with the remove roles yet.
         * Therefore, I'm using a timeout to wait for a while before adding new
         * roles to prevent the race condition.
         * This hack should be removed when it's fixed in a stable version of
         * discord.js.
         */
        setTimeout(async () => {
          let allLevelUpRoles = levelUpRoleIDs[level];
          allLevelUpRoles = allLevelUpRoles.filter(role => !message.member.roles.has(role));

          await message.member.addRoles(allLevelUpRoles, 'Level Up').catch(() => {});
        }, 500);
      }
      else {
        let allLevelUpRoles = Object.filter(levelUpRoleIDs, ([ level ]) => level <= currentLevel);
        allLevelUpRoles = Object.values(allLevelUpRoles).flatten();
        allLevelUpRoles = allLevelUpRoles.filter(role => !message.member.roles.has(role));

        await message.member.addRoles(allLevelUpRoles, 'Level Up').catch(() => {});
      }
    }
  }
  catch (e) {
    message.client.log.error(e);
  }
};
