const fs = require('fs');
const path = require('path');

exports.func = function (src) {
  return fs.readdirSync(src).filter(file => fs.statSync(path.join(src, file)).isDirectory());
};
