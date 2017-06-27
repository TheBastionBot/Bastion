/**
 * @file greet command
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

  Bastion.db.get(`SELECT greet, greetChannelID FROM guildSettings WHERE guildID=${message.guild.id}`).then(row => {
    let color, greetStats;
    if (row.greetChannelID === message.channel.id) {
      Bastion.db.run(`UPDATE guildSettings SET greet='false', greetChannelID=null WHERE guildID=${message.guild.id}`).catch(e => {
        Bastion.log.error(e);
      });
      color = Bastion.colors.red;
      greetStats = 'Greeting Messages are now disabled.';
    }
    else {
      Bastion.db.run(`UPDATE guildSettings SET greet='true', greetChannelID=${message.channel.id} WHERE guildID=${message.guild.id}`).catch(e => {
        Bastion.log.error(e);
      });
      color = Bastion.colors.green;
      greetStats = 'Greeting Messages are now enabled in this channel.';
    }

    message.channel.send({
      embed: {
        color: color,
        description: greetStats
      }
    }).catch(e => {
      Bastion.log.error(e);
    });
  }).catch(e => {
    Bastion.log.error(e);
  });
};

exports.config = {
  aliases: [],
  enabled: true
};

exports.help = {
  name: 'greet',
  description: string('greet', 'commandDescription'),
  botPermission: '',
  userPermission: 'ADMINISTRATOR',
  usage: 'greet',
  example: []
};
