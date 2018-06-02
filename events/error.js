/**
 * @file error event
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

const COLOR = xrequire('chalk');

module.exports = (error, description, channel) => {
  if (channel) {
    channel.send({
      embed: {
        color: channel.client.colors.RED,
        title: `${error}`,
        description: `${description}`
      }
    }).catch(e => {
      channel.client.log.error(e);
    });
  }
  else {
    /* eslint-disable no-console */
    console.log(COLOR.red('[ERROR EVENT]'));
    console.log(error);
    console.log(COLOR.red('[/ERROR EVENT]'));
  }
};
