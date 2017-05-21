const fs = require('fs');
const path = require('path');

module.exports = src => {
  // eslint-disable-next-line no-sync
  return fs.readdirSync(src).filter(file => fs.statSync(path.join(src, file)).isDirectory());
};
