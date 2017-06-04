/**
 * @file bastionLog command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.run = (Bastion, message) => {
  if (!Bastion.credentials.ownerId.includes(message.author.id)) {
    /**
     * User has missing permissions.
     * @fires userMissingPermissions
     */
    return Bastion.emit('userMissingPermissions', this.help.userPermission);
  }

  Bastion.db.get('SELECT log, logChannelID FROM bastionSettings').then(row => {
    let color = Bastion.colors.green;
    let logStats = 'Bastion\'s logging is now enabled in this channel.';
    if (!row) {
      Bastion.db.run('INSERT INTO bastionSettings (log, logChannelID) VALUES (?, ?)', [ 'true', message.channel.id ]).catch(e => {
        Bastion.log.error(e.stack);
      });
    }
    else if (row.log === 'false') {
      Bastion.db.run(`UPDATE bastionSettings SET log='true', logChannelID=${message.channel.id}`).catch(e => {
        Bastion.log.error(e.stack);
      });
    }
    else {
      Bastion.db.run('UPDATE bastionSettings SET log=\'false\', logChannelID=null').catch(e => {
        Bastion.log.error(e.stack);
      });
      color = Bastion.colors.red;
      logStats = 'Bastion\'s logging is now disabled.';
    }
    message.channel.send({
      embed: {
        color: color,
        description: logStats
      }
    }).catch(e => {
      Bastion.log.error(e.stack);
    });
  }).catch(e => {
    Bastion.log.error(e.stack);
  });
};

exports.config = {
  aliases: [ 'botlog' ],
  enabled: true
};

exports.help = {
  name: 'bastionlog',
  description: 'Toggle logging of various events of the bot.',
  botPermission: '',
  userPermission: 'BOT_OWNER',
  usage: 'bastionLog',
  example: []
};
