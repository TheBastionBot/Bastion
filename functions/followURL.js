const request = require('request');

module.exports = (url) => {
  return new Promise((resolve, reject) => {
    request( { method: 'HEAD', url: url, followAllRedirects: true },
      function (error, response) {
        if (error) {
          reject(error);
        }
        else {
          resolve(response.request.href);
        }
      });
  });
};
