Object.prototype.filter = function (predicate) {
  return Object.fromPairs(Object.entries(this).filter(predicate));
};
