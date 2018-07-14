/**
 * @file followURL
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

const request = xrequire('request-promise-native');

module.exports = (url) => {
  return new Promise(async (resolve, reject) => {
    try {
      let options = {
        method: 'HEAD',
        url: url,
        followAllRedirects: true,
        resolveWithFullResponse: true
      };

      let response = await request(options);
      resolve(response.request.href);
    }
    catch (e) {
      reject(e);
    }
  });
};
