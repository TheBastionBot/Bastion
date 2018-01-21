/**
 * @file reloadSettings command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.exec = (Bastion, message) => {
  try {
    // eslint-disable-next-line no-sync
    let settings = Bastion.functions.listFilesSync('settings');
    for (let file of settings) {
      delete require.cache[require.resolve(`../../settings/${file}`)];
    }
    Bastion.config = require('../../settings/config.json');
    Bastion.credentials = require('../../settings/credentials.json');

    message.channel.send({
      embed: {
        color: Bastion.colors.GREEN,
        description: 'Successfully reloaded all the settings.'
      }
    }).catch(e => {
      Bastion.log.error(e);
    });
  }
  catch (e) {
    Bastion.log.error(e);
  }
};

exports.config = {
  aliases: [],
  enabled: true,
  ownerOnly: true
};

exports.help = {
  name: 'reloadSettings',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'reloadSettings',
  example: []
};
