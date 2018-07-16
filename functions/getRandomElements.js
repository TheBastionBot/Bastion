/**
 * @file getRandomElements
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

module.exports = (seed, count = 1) => {
  let randomElements = [];

  for (let i = 0; i < count; i++) {
    let randomElement = seed[Math.floor(Math.random() * seed.length)];
    randomElements.push(randomElement);
  }

  return randomElements;
};
