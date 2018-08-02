/**
 * @file timezoneOffsetToDate
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

/**
 * Convert timezone offset to a Date object
 * @param {number} offset the timezone offset in hours
 * @returns {object} the date object
 */
module.exports = offset => {
  /** Convert offset from hour to miliseconds */
  offset = (60 * 60 * 1000 * offset);

  /** Get the current UTC time */
  const UTC = new Date().getTime();

  return new Date(UTC + offset);
};
