/**
 * @file reloadSettings command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

exports.exec = (Bastion, message) => {
  try {
    // eslint-disable-next-line no-sync
    let settings = Bastion.methods.listFilesSync('settings');
    for (let file of settings) {
      delete xrequire.cache[xrequire.resolve(`./settings/${file}`)];
    }
    Bastion.configurations = xrequire('./settings/config.json');
    Bastion.credentials = xrequire('./settings/credentials.json');

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
  description: 'Reloads Bastion settings, stored in the `settings` directory, from the cache. When you modify files in the `settings` directory, use this command to reload them without any need to restart.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'reloadSettings',
  example: []
};
