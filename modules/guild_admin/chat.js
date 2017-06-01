/**
 * @file chat command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const sql = require('sqlite');
sql.open('./data/Bastion.sqlite');

exports.run = (Bastion, message) => {
  if (!message.member.hasPermission(this.help.userPermission)) {
    return Bastion.emit('userMissingPermissions', this.help.userPermission);
  }

  if (!Bastion.credentials.cleverbotAPIkey) {
    return message.channel.send({
      embed: {
        color: Bastion.colors.red,
        description: 'Cleverbot API key has not been set. I can\'t chat with you! :sob:'
      }
    }).catch(e => {
      Bastion.log.error(e.stack);
    });
  }

  sql.get(`SELECT chat FROM guildSettings WHERE guildID=${message.guild.id}`).then(row => {
    let color, chatStats;
    if (row.chat === 'false') {
      sql.run(`UPDATE guildSettings SET chat='true' WHERE guildID=${message.guild.id}`).catch(e => {
        Bastion.log.error(e.stack);
      });
      color = Bastion.colors.green;
      chatStats = 'Enabled chat in this server. Now I\'ll respond if anyone mentions me, Ain\'t that cool? :sunglasses:';
    }
    else {
      sql.run(`UPDATE guildSettings SET chat='false' WHERE guildID=${message.guild.id}`).catch(e => {
        Bastion.log.error(e.stack);
      });
      color = Bastion.colors.red;
      chatStats = 'Disabled chat in this server. Now I\'m gonna miss talking with you. :disappointed:';
    }

    message.channel.send({
      embed: {
        color: color,
        description: chatStats
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
  name: 'chat',
  description: 'Toggles chatting feature of the bot.',
  botPermission: '',
  userPermission: 'ADMINISTRATOR',
  usage: 'chat',
  example: []
};
