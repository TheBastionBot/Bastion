/**
 * @file makeBWAPIRequest
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

const BastionWebAPI = xrequire('bwapi');
const BWAPI = new BastionWebAPI({
  'User-Agent': 'Bastion Discord Bot (https://bastionbot.org)'
});

module.exports = (path) => {
  return new Promise(async (resolve, reject) => {
    try {
      let response = await BWAPI.request(path);

      resolve(response);
    }
    catch (e) {
      reject(e);
    }
  });
};
