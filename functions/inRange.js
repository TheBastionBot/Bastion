/**
 * @file inRange
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

module.exports = (num, min, max, inclusive = false) => {
  if (inclusive) {
    return num >= min && num <= max;
  }
  return num > min && num < max;
};
