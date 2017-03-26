const fs = require('fs');
const path = require('path');

module.exports = src => {
  return fs.readdirSync(src).filter(file => fs.statSync(path.join(src, file)).isDirectory());
};
