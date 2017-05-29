/**
 * @file greet command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const sql = require('sqlite');
sql.open('./data/Bastion.sqlite');

exports.run = (Bastion, message) => {
  if (!message.member.hasPermission('ADMINISTRATOR')) return Bastion.log.info('User doesn\'t have permission to use this command.');

  sql.get(`SELECT greet, greetChannelID FROM guildSettings WHERE guildID=${message.guild.id}`).then(row => {
    let color, greetStats;
    if (row.greetChannelID === message.channel.id) {
      sql.run(`UPDATE guildSettings SET greet='false', greetChannelID=null WHERE guildID=${message.guild.id}`).catch(e => {
        Bastion.log.error(e.stack);
      });
      color = Bastion.colors.red;
      greetStats = 'Greeting Messages are now disabled.';
    }
    else {
      sql.run(`UPDATE guildSettings SET greet='true', greetChannelID=${message.channel.id} WHERE guildID=${message.guild.id}`).catch(e => {
        Bastion.log.error(e.stack);
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
  name: 'greet',
  description: 'Toggle greeting message for new members of the server.',
  botPermission: '',
  userPermission: 'Administrator',
  usage: 'greet',
  example: []
};
