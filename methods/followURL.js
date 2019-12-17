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
        url: `https://thebastionbot.herokuapp.com/url/follow?url=${url}`,
        headers: {
          'User-Agent': 'Bastion Discord Bot (https://bastion.traction.one)'
        },
        json: true
      };

      let { followedURL } = await request(options);

      resolve(followedURL);
    }
    catch (e) {
      reject(e);
    }
  });
};
