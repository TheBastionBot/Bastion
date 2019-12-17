/**
 * @file getPatron
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

const request = xrequire('./methods/makeBWAPIRequest');

module.exports = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      let patron = await request(`/patreon/patrons/${id}`);
      return resolve(patron);
    }
    catch (e) {
      reject(e);
    }
  });
};
