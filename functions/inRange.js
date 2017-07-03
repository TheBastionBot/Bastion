module.exports = (num, min, max, inclusive = false) => {
  if (inclusive) {
    return num >= min && num <= max;
  }
  return num > min && num < max;
};
