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
      message.client.db.run('INSERT INTO profiles (userID, xp) VALUES (?, ?)', [ message.author.id, 1 ]);
    }
    else {
      let currentLevel = Math.floor(0.1 * Math.sqrt(profile.xp + 1));

      if (currentLevel > profile.level) {
        message.client.db.run(`UPDATE profiles SET bastionCurrencies=${profile.bastionCurrencies + currentLevel * 5}, xp=${profile.xp + 1}, level=${currentLevel} WHERE userID=${message.author.id}`);

        let levelUpMessage = await message.client.db.get(`SELECT levelUpMessage FROM guildSettings WHERE guildID=${message.guild.id}`);
        if (levelUpMessage === 'false') return;

        message.channel.send({
          embed: {
            color: message.client.colors.blue,
            title: 'Leveled up',
            description: `:up: **${message.author.username}**#${message.author.discriminator} leveled up to **Level ${currentLevel}**`
          }
        }).catch(e => {
          message.client.log.error(e);
        });
      }
      else {
        message.client.db.run(`UPDATE profiles SET xp=${profile.xp + 1} WHERE userID=${message.author.id}`);
      }
    }
  }
  catch (e) {
    message.client.log.error(e);
  }
};
