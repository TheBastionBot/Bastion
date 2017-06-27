/**
 * @file greetDMMessage command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const string = require('../../handlers/languageHandler');

exports.run = (Bastion, message, args) => {
  if (!message.member.hasPermission(this.help.userPermission)) {
    /**
     * User has missing permissions.
     * @fires userMissingPermissions
     */
    return Bastion.emit('userMissingPermissions', this.help.userPermission);
  }

  if (args.length < 1) {
    Bastion.db.get(`SELECT greetDMMessage FROM guildSettings WHERE guildID=${message.guild.id}`).then(guild => {
      message.channel.send({
        embed: {
          color: Bastion.colors.dark_grey,
          title: 'DM Greeting message:',
          description: guild.greetDMMessage
        }
      }).catch(e => {
        Bastion.log.error(e);
      });
    }).catch(e => {
      Bastion.log.error(e);
    });
  }
  else {
    Bastion.db.run(`UPDATE guildSettings SET greetDMMessage="${args.join(' ').replace(/"/g, '\'')}" WHERE guildID=${message.guild.id}`).catch(e => {
      Bastion.log.error(e);
    });

    message.channel.send({
      embed: {
        color: Bastion.colors.green,
        title: 'DM Greeting message set to:',
        description: args.join(' ')
      }
    }).catch(e => {
      Bastion.log.error(e);
    });
  }
};

exports.config = {
  aliases: [ 'gdmmsg' ],
  enabled: true
};

exports.help = {
  name: 'greetdmmessage',
  description: string('greetDMMessage', 'commandDescription'),
  botPermission: '',
  userPermission: 'ADMINISTRATOR',
  usage: 'greetDMMessage [Message]',
  example: [ 'greetDMMessage Hello $user! Welcome to $server.' ]
};
