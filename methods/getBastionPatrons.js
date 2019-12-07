/**
 * @file getBastionPatrons
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

const request = xrequire('./methods/makeBWAPIRequest');

module.exports = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let patrons = await request('/patreon/patrons/active');
      return resolve(patrons);
    }
    catch (e) {
      reject(e);
    }
  });
};
