/**
 * @file compareVersion
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

const request = require('request-promise-native');
const package = xrequire('./package.json');

const getPackageUrl = (branch) => `https://raw.githubusercontent.com/TheBastionBot/Bastion/${branch}/package.json`;

const compare = (latest, current) => {
  if (latest > current) return 1;
  else if (latest < current) return -1;
  else return 0;
};

const compareVersion = (latestVersion, currentVersion) => {
  let latest = latestVersion.split('.');
  let current = currentVersion.split('.');

  let major = compare(latest[0], current[0]);
  let minor = compare(latest[1], current[1]);
  let patch = compare(latest[2], current[2]);

  switch (major) {
    case 0:
      switch (minor) {
        case 0:
          switch (patch) {
            default:
              return patch;
          }
        default:
          return minor;
      }
    default:
      return major;
  }
};

module.exports = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let options = {
        headers: {
          'User-Agent': 'Bastion Discord Bot (https://bastionbot.org)'
        },
        json: true
      };

      let latestPackage = await request(getPackageUrl('stable'), options);

      let result = compareVersion(latestPackage.version, package.version);

      if (result === -1) {
        latestPackage = await request(getPackageUrl('master'), options);
        result = compareVersion(latestPackage.version, package.version);
      }

      resolve(result);
    }
    catch (e) {
      reject(e);
    }
  });
};
