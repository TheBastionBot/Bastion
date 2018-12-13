const request = require('request-promise-native');

module.exports = (url) => {
  return new Promise(async (resolve, reject) => {
    try {
      let options = {
        url: `https://api.bastionbot.org/url/follow?url=${url}`,
        headers: {
          'User-Agent': 'Bastion Discord Bot (https://bastionbot.org)'
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
