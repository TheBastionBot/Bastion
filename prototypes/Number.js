Number.random = (lower = Number.MIN_SAFE_INTEGER, upper = Number.MAX_SAFE_INTEGER) => {
  lower = Math.ceil(lower);
  upper = Math.floor(upper);

  return Math.floor(Math.random() * (upper - lower + 1)) + lower;
};

Number.inRange = (num, lower = Number.MIN_SAFE_INTEGER, upper = Number.MAX_SAFE_INTEGER, inclusive = true) => {
  if (inclusive) return num >= lower && num <= upper;
  return num > lower && num < upper;
};
