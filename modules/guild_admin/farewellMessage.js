/**
 * @file farewellMessage command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const sql = require('sqlite');
sql.open('./data/Bastion.sqlite');

exports.run = (Bastion, message, args) => {
  if (!message.member.hasPermission(this.help.userPermission)) {
    return Bastion.emit('userMissingPermissions', this.help.userPermission);
  }

  if (args.length < 1) {
    sql.get(`SELECT farewellMessage FROM guildSettings WHERE guildID=${message.guild.id}`).then(guild => {
      message.channel.send({
        embed: {
          color: Bastion.colors.dark_grey,
          title: 'Farewell message:',
          description: guild.farewellMessage
        }
      }).catch(e => {
        Bastion.log.error(e.stack);
      });
    }).catch(e => {
      Bastion.log.error(e.stack);
    });
  }
  else {
    sql.run(`UPDATE guildSettings SET farewellMessage="${args.join(' ').replace(/"/g, '\'')}" WHERE guildID=${message.guild.id}`).catch(e => {
      Bastion.log.error(e.stack);
    });

    message.channel.send({
      embed: {
        color: Bastion.colors.green,
        title: 'Farewell message set to:',
        description: args.join(' ')
      }
    }).catch(e => {
      Bastion.log.error(e.stack);
    });
  }
};

exports.config = {
  aliases: [ 'fmsg' ],
  enabled: true
};

exports.help = {
  name: 'farewellmessage',
  description: 'Edit the farewell message that shows when a member leaves the server.',
  botPermission: '',
  userPermission: 'ADMINISTRATOR',
  usage: 'farewellMessage [Message]',
  example: [ 'farewellMessage Goodbye $username. Hope to see you soon!' ]
};
