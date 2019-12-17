/**
 * @file makeBWAPIRequest
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

const BastionWebAPI = xrequire('bwapi');
const BWAPI = new BastionWebAPI({
  headers: {
    'User-Agent': 'Bastion Discord Bot (https://bastion.traction.one)'
  }
});

module.exports = (path, options) => {
  return new Promise(async (resolve, reject) => {
    try {
      let response = await BWAPI.request(path, options);

      resolve(response);
    }
    catch (e) {
      reject(e);
    }
  });
};
