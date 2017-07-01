module.exports = function(...a) {
  return [ ...a ].reduce((p, c) => p.filter(e => c.includes(e)));
};
