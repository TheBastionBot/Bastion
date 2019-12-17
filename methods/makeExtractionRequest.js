/**
 * @file makeExtractionRequest
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

const ExtractionAPI = require('ex.traction');
const extraction = new ExtractionAPI({
  headers: {
    'User-Agent': 'Bastion Discord Bot (https://bastion.traction.one)'
  }
});

module.exports = (path, options) => {
  return new Promise(async (resolve, reject) => {
    try {
      let response = await extraction.request(path, options);

      resolve(response);
    }
    catch (e) {
      reject(e);
    }
  });
};
