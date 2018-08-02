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
          model: message.client.database.models.role,
          attributes: [ 'roleID', 'level' ]
        }
      ]
    });


    guildMemberModel.dataValues.experiencePoints = parseInt(guildMemberModel.dataValues.experiencePoints);
    guildMemberModel.dataValues.level = parseInt(guildMemberModel.dataValues.level);
    guildMemberModel.dataValues.bastionCurrencies = parseInt(guildMemberModel.dataValues.bastionCurrencies);

    let currentLevel = Math.floor(0.15 * Math.sqrt(guildMemberModel.dataValues.experiencePoints + 1));


    // Level Up
    if (guildModel.dataValues.levelUps) {
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
    for (let role of levelUpRoles) {
      if (!levelUpRoleIDs.hasOwnProperty(role.level)) {
        levelUpRoleIDs[role.level] = [];
      }

      levelUpRoleIDs[role.level].push(role.roleID);
    }

    let level = `${currentLevel}`;
    if (levelUpRoleIDs.hasOwnProperty(level)) {
      await message.member.addRoles(levelUpRoleIDs[level]).catch(() => {});
    }
  }
  catch (e) {
    message.client.log.error(e);
  }
};
