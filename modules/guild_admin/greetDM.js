/**
 * @file greetDM command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const string = require('../../handlers/languageHandler');

exports.run = (Bastion, message) => {
  if (!message.member.hasPermission(this.help.userPermission)) {
    /**
     * User has missing permissions.
     * @fires userMissingPermissions
     */
    return Bastion.emit('userMissingPermissions', this.help.userPermission);
  }

  Bastion.db.get(`SELECT greetDM FROM guildSettings WHERE guildID=${message.guild.id}`).then(row => {
    let color, greetDMStats;
    if (row.greetDM === 'true') {
      Bastion.db.run(`UPDATE guildSettings SET greetDM='false' WHERE guildID=${message.guild.id}`).catch(e => {
        Bastion.log.error(e.stack);
      });
      color = Bastion.colors.red;
      greetDMStats = 'Sending Greeting Message as Direct Messages are now disabled.';
    }
    else {
      Bastion.db.run(`UPDATE guildSettings SET greetDM='true' WHERE guildID=${message.guild.id}`).catch(e => {
        Bastion.log.error(e.stack);
      });
      color = Bastion.colors.green;
      greetDMStats = 'Sending Greeting Message as Direct Messages are now enabled.';
    }

    message.channel.send({
      embed: {
        color: color,
        description: greetDMStats
      }
    }).catch(e => {
      Bastion.log.error(e.stack);
    });
  }).catch(e => {
    Bastion.log.error(e.stack);
  });
};

exports.config = {
  aliases: [],
  enabled: true
};

exports.help = {
  name: 'greetdm',
  description: string('greetDM', 'commandDescription'),
  botPermission: '',
  userPermission: 'ADMINISTRATOR',
  usage: 'greetDM',
  example: []
};
