/**
 * @file encodeString
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

const lzutf8 = xrequire('lzutf8');

/**
 * Encodes/Compresses a string to BinaryString with LZUTF8
 * @param {String} string the original string data
 * @returns {BinaryString} the compressed BinaryString
 */
module.exports = (string) => {
  return new Promise((resolve, reject) => {
    let options = {
      outputEncoding: 'StorageBinaryString'
    };

    let callback = function (data, error) {
      if (error) {
        reject(error);
      }
      resolve(data);
    };

    lzutf8.compressAsync(string, options, callback);
  });
};
