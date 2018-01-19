const fs = require('fs');

module.exports = dir => {
  // eslint-disable-next-line no-sync
  return fs.readdirSync(`./${dir}`);
};
