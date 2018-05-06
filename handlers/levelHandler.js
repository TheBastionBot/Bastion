/**
 * @file levelHandler
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

/**
 * Handles user's experience points and levels
 * @param {Message} message Discord.js message object
 * @returns {void}
 */

const { bastionGuild } = require('../data/specialIDs.json');

module.exports = async message => {
  try {
    let profile = await message.client.db.get(`SELECT * FROM profiles WHERE userID=${message.author.id}`);

    if (!profile) {
      await message.client.db.run('INSERT INTO profiles (userID, xp) VALUES (?, ?)', [ message.author.id, 1 ]);
    }
    else {
      profile.xp = parseInt(profile.xp);
      profile.level = parseInt(profile.level);
      profile.bastionCurrencies = parseInt(profile.bastionCurrencies);

      let incrementedXP = message.guild.id === bastionGuild ? profile.xp + 2 : profile.xp + 1;

      let currentLevel = Math.floor(0.15 * Math.sqrt(incrementedXP));

      if (currentLevel > profile.level) {
        await message.client.db.run(`UPDATE profiles SET bastionCurrencies=${profile.bastionCurrencies + currentLevel * 5}, xp=${incrementedXP}, level=${currentLevel} WHERE userID=${message.author.id}`);

        let guildSettings = await message.client.db.get(`SELECT levelUpMessage FROM guildSettings WHERE guildID=${message.guild.id}`);
        if (!guildSettings.levelUpMessage) return;

        message.channel.send({
          embed: {
            color: message.client.colors.BLUE,
            title: 'Leveled up',
            description: `:up: **${message.author.username}**#${message.author.discriminator} leveled up to **Level ${currentLevel}**`
          }
        }).then(msg => {
          msg.delete(5000).catch(() => {});
        }).catch(e => {
          message.client.log.error(e);
        });
      }
      else {
        await message.client.db.run(`UPDATE profiles SET xp=${incrementedXP} WHERE userID=${message.author.id}`);
      }

      // Level up roles
      let guildSettings = await message.client.db.get(`SELECT levelUpRoles FROM guildSettings WHERE guildID=${message.guild.id}`);
      if (guildSettings && guildSettings.levelUpRoles) {
        let levelUpRoles = await message.client.functions.decodeString(guildSettings.levelUpRoles);
        levelUpRoles = JSON.parse(levelUpRoles);

        let level = `${currentLevel}`;
        if (levelUpRoles.hasOwnProperty(level)) {
          let roles = levelUpRoles[level].split(' ');
          await message.member.addRoles(roles).catch(() => {});
        }
      }
    }
  }
  catch (e) {
    message.client.log.error(e);
  }
};
