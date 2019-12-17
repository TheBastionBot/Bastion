/**
 * @file postToDiscordBots
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

const request = require('request-promise-native');

/**
 * Posts guild count to Discord Bots
 * @param {TesseractClient} Bastion Tesseract client object
 * @returns {void}
 */
module.exports = async Bastion => {
  try {
    if (!Bastion.methods.isPublicBastion(Bastion)) return;

    let requestBody = {
      guildCount: Bastion.guilds.size
    };

    if (Bastion.shard) {
      requestBody.shardCount = Bastion.shard.count;
      requestBody.shardId = Bastion.shard.id;
    }


    let url = `https://discord.bots.gg/api/v1/bots/${BASTION_CLIENT_ID}/stats`;
    let options = {
      body: requestBody,
      headers: {
        'Authorization': Bastion.credentials.discordBotsAPIToken,
        'User-Agent': 'Bastion Discord Bot (https://bastion.traction.one)'
      },
      json: true
    };

    return await request.post(url, options);
  }
  catch (e) {
    Bastion.log.error(e);
  }
};
