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

      let currentLevel = Math.floor(0.15 * Math.sqrt(profile.xp + 1));

      if (currentLevel > profile.level) {
        await message.client.db.run(`UPDATE profiles SET bastionCurrencies=${profile.bastionCurrencies + currentLevel * 5}, xp=${profile.xp + 1}, level=${currentLevel} WHERE userID=${message.author.id}`);

        let guildSettings = await message.client.db.get(`SELECT levelUpMessage FROM guildSettings WHERE guildID=${message.guild.id}`);
        if (!guildSettings.levelUpMessage) return;

        message.channel.send({
          embed: {
            color: message.client.colors.BLUE,
            title: 'Leveled up',
            description: `:up: **${message.author.username}**#${message.author.discriminator} leveled up to **Level ${currentLevel}**`
          }
        }).catch(e => {
          message.client.log.error(e);
        });
      }
      else {
        await message.client.db.run(`UPDATE profiles SET xp=${profile.xp + 1} WHERE userID=${message.author.id}`);
      }
    }
  }
  catch (e) {
    message.client.log.error(e);
  }
};
