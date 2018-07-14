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
