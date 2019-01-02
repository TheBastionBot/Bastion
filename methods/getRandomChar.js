/**
 * @file getRandomChar
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

// TODO: Use alias method
module.exports = (asFirstLetter = false) => {
  let relFreq;
  if (asFirstLetter) {
    relFreq = {
      t: 15.978, a: 11.682, o: 7.631, i: 7.294, s: 6.686, w: 5.497, c: 5.238,
      b: 4.434, p: 4.319, h: 4.200, f: 4.027, m: 3.826, d: 3.174, r: 2.826,
      e: 2.799, k: 2.456, l: 2.415, n: 2.284, g: 1.642, u: 1.183, v: 0.824,
      y: 0.763, j: 0.511, q: 0.222, x: 0.045, z: 0.045
    };
  }
  else {
    relFreq = {
      e: 12.702, t: 9.256, a: 8.167, o: 7.507, i: 6.966, n: 6.749, s: 6.327,
      h: 6.094, r: 5.987, w: 5.370, d: 4.253, l: 4.025, y: 3.978, k: 3.872,
      c: 2.782, u: 2.758, m: 2.406, f: 2.228, g: 2.015, p: 1.929, b: 1.492,
      v: 0.978, j: 0.153, x: 0.150, q: 0.095, z: 0.074
    };
  }

  let charPool = Object.keys(relFreq);
  let charProbDist = Object.values(relFreq);

  // Calculate the cumulative sums of the distribution
  let cumSum = charProbDist.reduce((acc, cur, idx) => [ ...acc, acc.length > 0 ? cur + acc[idx - 1] : cur ], []);

  let charProbSum = charProbDist.reduce((acc, cur) => acc + cur, 0);

  // Generate a random number n in the range of 0 to total sum of cumulative probabilities.
  let randomVar = (Math.random() * (0 - charProbSum) + charProbSum);

  // Find the first item whose cumulative sum is greather than the random number.
  let randomIdx = cumSum.findIndex((ele) => ele > randomVar);

  // The corresponding character is the random character
  return charPool[randomIdx];
};
