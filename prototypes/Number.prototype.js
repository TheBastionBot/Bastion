Number.prototype.clamp = function (lower = Number.MIN_SAFE_INTEGER, upper = Number.MAX_SAFE_INTEGER, inclusive = true) {
  let number = this.valueOf();

  number = number <= upper ? number : inclusive ? upper : upper - 1;
  number = number >= lower ? number : inclusive ? lower : lower + 1;

  return number;
};

Number.prototype.inRange = function (lower = Number.MIN_SAFE_INTEGER, upper = Number.MAX_SAFE_INTEGER, inclusive = true) {
  if (inclusive) return this >= lower && this <= upper;
  return this > lower && this < upper;
};

Number.prototype.toHumanString = function() {
  let billion = 1000000000, million = 1000000, thousand = 1000;

  let number = this;

  if (number >= billion) {
    number = (number / billion);
    number = `${trimFloat(number)}b`;
  }
  else if (number >= million) {
    number = (number / million);
    number = `${trimFloat(number)}m`;
  }
  else if (number >= thousand) {
    number = (number / thousand);
    number = `${trimFloat(number)}k`;
  }

  return number;
};

/**
 * Trims a floating point number to 0 or 1 decimal precision.
 * @function trimFloat
 * @param {Number} float a floating point number
 * @returns {Number} A Float (of precision 1) or an Integer
 */
function trimFloat(float) {
  float = float.toFixed(1);
  // eslint-disable-next-line eqeqeq
  if (float == parseInt(float)) {
    return parseInt(float);
  }
  return float;
}
