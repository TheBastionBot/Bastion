/**
 * @file sendHeartbeat
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

/**
 * Send a heartbeat to Bastion Web API.
 * @param {TesseractClient} Bastion Tesseract client object
 * @returns {void}
 */
module.exports = async Bastion => {
  try {
    return await Bastion.methods.makeBWAPIRequest('/heartbeat', {
      method: 'POST',
      body: {
        bot: Bastion.user.id
      }
    });
  }
  catch (e) {
    Bastion.log.error(e);
  }
};
