/**
 * @file levelUpMessage command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const sql = require('sqlite');
sql.open('./data/Bastion.sqlite');

exports.run = (Bastion, message) => {
  if (!message.member.hasPermission(this.help.userPermission)) return Bastion.log.info('User doesn\'t have permission to use this command.');

  sql.get(`SELECT levelUpMessage FROM guildSettings WHERE guildID=${message.guild.id}`).then(guild => {
    let color, levelUpMessageStats;
    if (guild.levelUpMessage === 'true') {
      sql.run(`UPDATE guildSettings SET levelUpMessage='false' WHERE guildID=${message.guild.id}`).catch(e => {
        Bastion.log.error(e.stack);
      });
      color = Bastion.colors.red;
      levelUpMessageStats = 'I won\'t any send messages when someone levels up from now on.';
    }
    else {
      sql.run(`UPDATE guildSettings SET levelUpMessage='true' WHERE guildID=${message.guild.id}`).catch(e => {
        Bastion.log.error(e.stack);
      });
      color = Bastion.colors.green;
      levelUpMessageStats = 'I will now send messages when someone levels up.';
    }

    message.channel.send({
      embed: {
        color: color,
        description: levelUpMessageStats
      }
    }).catch(e => {
      Bastion.log.error(e.stack);
    });
  }).catch(e => {
    Bastion.log.error(e.stack);
  });
};

exports.config = {
  aliases: [ 'lvlupmsg' ],
  enabled: true
};

exports.help = {
  name: 'levelupmessage',
  description: 'Toggles sending messages when someone levels up in this server.',
  botPermission: '',
  userPermission: 'ADMINISTRATOR',
  usage: 'levelUpMessage',
  example: []
};
