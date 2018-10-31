/**
 * @file rot13
 * @author Ruben Roy
 * @license GPL-3.0
 */

/**
 * Encodes string to ROT13
 * See {@link https://en.wikipedia.org/wiki/ROT13|Wikipedia} article
 * @param {string} str - The string to encode
 * @returns {string} The encoded string
 * sources https://codereview.stackexchange.com/questions/132125/rot13-javascript ?
 */
module.exports = (str) => {
  const input = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
  const output = 'NOPQRSTUVWXYZABCDEFGHIJKLMnopqrstuvwxyzabcdefghijklm'.split('');
  const lookup = input.reduce((m, k, i) => Object.assign(m, { [k]: output[i] }), {});
  return str.split('').map(x => lookup[x] || x).join('');
};
