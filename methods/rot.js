/**
 * @file rot
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

module.exports = (string, degree = 13) => {
  return string.replace(/[a-zA-Z]/g, (ch) => (
    String.fromCharCode(
      (ch <= 'Z' ? 90 : 122) >= (ch = ch.charCodeAt(0) + degree) ? ch : ch - 26
    )
  ));
};
