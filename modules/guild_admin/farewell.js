/**
 * @file farewell command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */
// I don't understand why this is even needed, but some fellows like this.

const string = require('../../handlers/languageHandler');

exports.run = (Bastion, message) => {
  if (!message.member.hasPermission(this.help.userPermission)) {
    /**
     * User has missing permissions.
     * @fires userMissingPermissions
     */
    return Bastion.emit('userMissingPermissions', this.help.userPermission);
  }

  Bastion.db.get(`SELECT farewell, farewellChannelID FROM guildSettings WHERE guildID=${message.guild.id}`).then(row => {
    let color, farewellStats;
    if (row.farewellChannelID === message.channel.id) {
      Bastion.db.run(`UPDATE guildSettings SET farewell='false', farewellChannelID=null WHERE guildID=${message.guild.id}`).catch(e => {
        Bastion.log.error(e.stack);
      });
      color = Bastion.colors.red;
      farewellStats = 'Farewell Messages are now disabled.';
    }
    else {
      Bastion.db.run(`UPDATE guildSettings SET farewell='true', farewellChannelID=${message.channel.id} WHERE guildID=${message.guild.id}`).catch(e => {
        Bastion.log.error(e.stack);
      });
      color = Bastion.colors.green;
      farewellStats = 'Farewell Messages are now enabled in this channel.';
    }

    message.channel.send({
      embed: {
        color: color,
        description: farewellStats
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
  name: 'farewell',
  description: string('farewell', 'commandDescription'),
  botPermission: '',
  userPermission: 'ADMINISTRATOR',
  usage: 'farewell',
  example: []
};
