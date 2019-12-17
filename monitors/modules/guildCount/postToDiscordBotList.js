/**
 * @file postToDiscordBotList
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

const request = require('request-promise-native');

/**
 * Posts guild count to Discord Bot List
 * @param {TesseractClient} Bastion Tesseract client object
 * @returns {void}
 */
module.exports = async Bastion => {
  try {
    if (!Bastion.methods.isPublicBastion(Bastion)) return;

    let requestBody = {
      server_count: Bastion.guilds.size
    };

    if (Bastion.shard) {
      requestBody.shard_count = Bastion.shard.count;
      requestBody.shard_id = Bastion.shard.id;
    }


    let url = `https://discordbots.org/api/bots/${BASTION_CLIENT_ID}/stats`;
    let options = {
      body: requestBody,
      headers: {
        'Authorization': Bastion.credentials.discordBotListAPIToken,
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
