const request = require('request-promise-native');

module.exports = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let options = {
        headers: {
          'User-Agent': 'Bastion Discord Bot (https://bastionbot.org)'
        },
        uri: 'https://api.bastionbot.org/github/contributors',
        json: true
      };

      let response = await request(options);

      let contributors = [];
      for (let contributor of Object.keys(response)) {
        if (response[contributor].type === 'User') {
          contributors.push({
            username: response[contributor].login,
            url: response[contributor].url,
            avatar: response[contributor].avatar,
            contributions: response[contributor].contributions
          });
        }
      }

      resolve(contributors);
    }
    catch (e) {
      reject(e);
    }
  });
};
