const sneakyLinks = require('./modules/sneakyLinks');

module.exports = async (message) => {
  try {
    await sneakyLinks(message);
  }
  catch (e) {
    message.client.log.error(e);
  }
};
