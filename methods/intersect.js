/**
 * @file intersect
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

module.exports = function(...a) {
  return [ ...a ].reduce((p, c) => p.filter(e => c.includes(e)));
};
