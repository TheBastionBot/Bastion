const request = require('request');

module.exports = (url) => {
  if (!/^(http[s]?:\/\/)(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&/=]*)$/i.test(url)) return;

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
