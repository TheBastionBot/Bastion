/**
 * @file greetMessage command
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
    sql.get(`SELECT greetMessage FROM guildSettings WHERE guildID=${message.guild.id}`).then(guild => {
      message.channel.send({
        embed: {
          color: Bastion.colors.dark_grey,
          title: 'Greeting message:',
          description: guild.greetMessage
        }
      }).catch(e => {
        Bastion.log.error(e.stack);
      });
    }).catch(e => {
      Bastion.log.error(e.stack);
    });
  }
  else {
    sql.run(`UPDATE guildSettings SET greetMessage="${args.join(' ').replace(/"/g, '\'')}" WHERE guildID=${message.guild.id}`).catch(e => {
      Bastion.log.error(e.stack);
    });

    message.channel.send({
      embed: {
        color: Bastion.colors.green,
        title: 'Greeting message set to:',
        description: args.join(' ')
      }
    }).catch(e => {
      Bastion.log.error(e.stack);
    });
  }
};

exports.config = {
  aliases: [ 'gmsg' ],
  enabled: true
};

exports.help = {
  name: 'greetmessage',
  description: 'Edit the greeting message that shows when a new member is joined in the server.',
  botPermission: '',
  userPermission: 'ADMINISTRATOR',
  usage: 'greetMessage [Message]',
  example: [ 'greetMessage Hello $user! Welcome to $server.' ]
};
