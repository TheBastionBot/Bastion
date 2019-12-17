/**
 * @file compareVersion
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

const request = require('request-promise-native');
const currentPackage = xrequire('./package.json');

/**
 * Fetch the package file for the specified branch of Bastion.
 * @param {string} branch The branch name
 * @returns {string} The URL for the package file for the specified branch
 */
const getPackageUrl = (branch) => `https://raw.githubusercontent.com/TheBastionBot/Bastion/${branch}/package.json`;

/**
 * Returns whether the current version with the latest version.
 * @param {number} latest The latest version number
 * @param {current} current The current version number
 * @returns {number} Whether the current version is less than (1), equal to (0)
 * or greater than (-1) the latest version
 */
const compare = (latest, current) => {
  if (latest > current) return 1;
  else if (latest < current) return -1;
  return 0;
};

/**
 * Compares the current semver number with the latest semver number.
 * @param {string} latestVersion The latest semver number
 * @param {string} currentVersion The current semver number
 * @returns {number} Whether the current semver number is less than (1),
 * equal to (0) or greater than (-1) the latest semver number
 */
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
          'User-Agent': 'Bastion Discord Bot (https://bastion.traction.one)'
        },
        json: true
      };

      let latestPackage = await request(getPackageUrl('stable'), options);

      let result = compareVersion(latestPackage.version, currentPackage.version);

      if (result === -1) {
        latestPackage = await request(getPackageUrl('master'), options);
        result = compareVersion(latestPackage.version, currentPackage.version);
      }

      resolve(result);
    }
    catch (e) {
      reject(e);
    }
  });
};
