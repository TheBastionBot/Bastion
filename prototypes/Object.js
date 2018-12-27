Object.fromPairs = (pairs) => {
  let index = -1;
  let length = pairs === null ? 0 : pairs.length;
  let result = {};

  while (++index < length) {
    let pair = pairs[index];
    result[pair[0]] = pair[1];
  }
  return result;
};

Object.filter = function (object, predicate) {
  return Object.fromPairs(Object.entries(object).filter(predicate));
};
