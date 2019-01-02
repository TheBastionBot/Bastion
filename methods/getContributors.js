/**
 * @file getContributors
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

const makeBWAPIRequest = xrequire('./methods/makeBWAPIRequest');

module.exports = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let response = await makeBWAPIRequest('/github/contributors');

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
