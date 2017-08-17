/**
 * @file bastionLog command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const string = require('../../handlers/languageHandler');

exports.run = async (Bastion, message) => {
  if (!Bastion.credentials.ownerId.includes(message.author.id)) {
    /**
     * User has missing permissions.
     * @fires userMissingPermissions
     */
    return Bastion.emit('userMissingPermissions', this.help.userPermission);
  }

  try {
    let bastionSettings = await Bastion.db.get('SELECT log, logChannelID FROM bastionSettings');
    let color = Bastion.colors.GREEN;
    let logStats = 'Bastion\'s logging is now enabled in this channel.';

    if (!bastionSettings) {
      await Bastion.db.run('INSERT INTO bastionSettings (log, logChannelID) VALUES (?, ?)', [ 'true', message.channel.id ]);
    }
    else if (bastionSettings.log === 'false') {
      await Bastion.db.run(`UPDATE bastionSettings SET log='true', logChannelID=${message.channel.id}`);
    }
    else {
      await Bastion.db.run('UPDATE bastionSettings SET log=\'false\', logChannelID=null');

      color = Bastion.colors.RED;
      logStats = 'Bastion\'s logging is now disabled.';
    }

    message.channel.send({
      embed: {
        color: color,
        description: logStats
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
  aliases: [ 'botlog' ],
  enabled: true
};

exports.help = {
  name: 'bastionlog',
  description: string('bastionLog', 'commandDescription'),
  botPermission: '',
  userPermission: 'BOT_OWNER',
  usage: 'bastionLog',
  example: []
};
