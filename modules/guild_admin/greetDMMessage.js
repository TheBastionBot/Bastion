/**
 * @file greetDMMessage command
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
    sql.get(`SELECT greetDMMessage FROM guildSettings WHERE guildID=${message.guild.id}`).then(guild => {
      message.channel.send({
        embed: {
          color: Bastion.colors.dark_grey,
          title: 'DM Greeting message:',
          description: guild.greetDMMessage
        }
      }).catch(e => {
        Bastion.log.error(e.stack);
      });
    }).catch(e => {
      Bastion.log.error(e.stack);
    });
  }
  else {
    sql.run(`UPDATE guildSettings SET greetDMMessage="${args.join(' ').replace(/"/g, '\'')}" WHERE guildID=${message.guild.id}`).catch(e => {
      Bastion.log.error(e.stack);
    });

    message.channel.send({
      embed: {
        color: Bastion.colors.green,
        title: 'DM Greeting message set to:',
        description: args.join(' ')
      }
    }).catch(e => {
      Bastion.log.error(e.stack);
    });
  }
};

exports.config = {
  aliases: [ 'gdmmsg' ],
  enabled: true
};

exports.help = {
  name: 'greetdmmessage',
  description: 'Edit the greeting message that is sent as direct message when a new member is joined in the server.',
  botPermission: '',
  userPermission: 'ADMINISTRATOR',
  usage: 'greetDMMessage [Message]',
  example: [ 'greetDMMessage Hello $user! Welcome to $server.' ]
};
