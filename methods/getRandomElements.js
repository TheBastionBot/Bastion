/**
 * @file getRandomElements
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

module.exports = (seed, count = 1, unique = false) => {
  if (unique && seed.length < count) {
    count = seed.length;
  }

  let randomElements = [];

  for (let i = 0; i < count; i++) {
    let randomElement = seed[Math.floor(Math.random() * seed.length)];
    randomElements.push(randomElement);

    if (unique) seed.splice(seed.indexOf(randomElement), 1);
  }

  return randomElements;
};
