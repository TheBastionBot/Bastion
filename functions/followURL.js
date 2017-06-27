const request = require('request');

module.exports = (url) => {
  return new Promise((resolve, reject) => {
    if (!/^(http[s]?:\/\/)(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&/=]*)$/i.test(url)) {
      resolve('Invalid URI');
    }

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
