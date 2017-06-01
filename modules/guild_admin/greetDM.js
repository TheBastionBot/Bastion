/**
 * @file greetDM command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const sql = require('sqlite');
sql.open('./data/Bastion.sqlite');

exports.run = (Bastion, message) => {
  if (!message.member.hasPermission(this.help.userPermission)) {
    return Bastion.emit('userMissingPermissions', this.help.userPermission);
  }

  sql.get(`SELECT greetDM FROM guildSettings WHERE guildID=${message.guild.id}`).then(row => {
    let color, greetDMStats;
    if (row.greetDM === 'true') {
      sql.run(`UPDATE guildSettings SET greetDM='false' WHERE guildID=${message.guild.id}`).catch(e => {
        Bastion.log.error(e.stack);
      });
      color = Bastion.colors.red;
      greetDMStats = 'Sending Greeting Message as Direct Messages are now disabled.';
    }
    else {
      sql.run(`UPDATE guildSettings SET greetDM='true' WHERE guildID=${message.guild.id}`).catch(e => {
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
  description: 'Toggle sending of greeting message as direct message for new members of the server.',
  botPermission: '',
  userPermission: 'ADMINISTRATOR',
  usage: 'greetDM',
  example: []
};
