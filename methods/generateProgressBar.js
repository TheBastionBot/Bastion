/**
 * @file generateProgressBar
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

module.exports = (percentage = 0, totalSteps = 10) => {
  percentage = percentage > 100 ? 100 : percentage;

  let complete = '█';
  let empty = '▒';

  let progress = Math.round((percentage / 100) * totalSteps);

  return `${complete.repeat(progress)}${empty.repeat(totalSteps - progress)}`;
};
