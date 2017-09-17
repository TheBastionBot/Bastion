/**
 * @file bastionLog command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.run = async (Bastion, message) => {
  if (!Bastion.credentials.ownerId.includes(message.author.id)) {
    /**
     * User has missing permissions.
     * @fires userMissingPermissions
     */
    return Bastion.emit('userMissingPermissions', this.help.userPermission);
  }

  try {
    let bastionSettings = await Bastion.db.get('SELECT logChannel FROM bastionSettings'),
      color = Bastion.colors.GREEN,
      logStats = 'Bastion\'s logging is now enabled in this channel.';

    if (!bastionSettings) {
      await Bastion.db.run('INSERT INTO bastionSettings (logChannel) VALUES (?)', [ message.channel.id ]);
    }
    else if (bastionSettings.log) {
      await Bastion.db.run('UPDATE bastionSettings SET logChannel=null');

      color = Bastion.colors.RED;
      logStats = 'Bastion\'s logging is now disabled.';
    }
    else {
      await Bastion.db.run(`UPDATE bastionSettings SET logChannel=${message.channel.id}`);
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
  name: 'bastionLog',
  botPermission: '',
  userPermission: 'BOT_OWNER',
  usage: 'bastionLog',
  example: []
};
