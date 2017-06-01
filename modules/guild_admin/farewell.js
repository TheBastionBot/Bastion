/**
 * @file farewell command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

// I don't understand why this is even needed, but some fellows like this.
const sql = require('sqlite');
sql.open('./data/Bastion.sqlite');

exports.run = (Bastion, message) => {
  if (!message.member.hasPermission(this.help.userPermission)) return Bastion.log.info('User doesn\'t have permission to use this command.');

  sql.get(`SELECT farewell, farewellChannelID FROM guildSettings WHERE guildID=${message.guild.id}`).then(row => {
    let color, farewellStats;
    if (row.farewellChannelID === message.channel.id) {
      sql.run(`UPDATE guildSettings SET farewell='false', farewellChannelID=null WHERE guildID=${message.guild.id}`).catch(e => {
        Bastion.log.error(e.stack);
      });
      color = Bastion.colors.red;
      farewellStats = 'Farewell Messages are now disabled.';
    }
    else {
      sql.run(`UPDATE guildSettings SET farewell='true', farewellChannelID=${message.channel.id} WHERE guildID=${message.guild.id}`).catch(e => {
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
  description: 'Toggle farewell message for members who left the server.',
  botPermission: '',
  userPermission: 'ADMINISTRATOR',
  usage: 'farewell',
  example: []
};
