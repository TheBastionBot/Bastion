/**
 * @file greetDMMessage command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const string = require('../../handlers/languageHandler');

exports.run = async (Bastion, message, args) => {
  if (!message.member.hasPermission(this.help.userPermission)) {
    /**
     * User has missing permissions.
     * @fires userMissingPermissions
     */
    return Bastion.emit('userMissingPermissions', this.help.userPermission);
  }

  if (args.length < 1) {
    let guildSettings = await Bastion.db.get(`SELECT greetPrivateMessage FROM guildSettings WHERE guildID=${message.guild.id}`).catch(e => {
      Bastion.log.error(e);
    });

    let greetPrivateMessage = `Not set. Set greeting private message using \`${this.help.name} <Message>\``;
    if (guildSettings.greetPrivateMessage) {
      greetPrivateMessage = await Bastion.functions.decodeString(guildSettings.greetPrivateMessage);
    }

    message.channel.send({
      embed: {
        color: Bastion.colors.blue,
        title: 'Greeting Private Message',
        description: greetPrivateMessage
      }
    }).catch(e => {
      Bastion.log.error(e);
    });
  }
  else {
    args = args.join(' ');

    let greetPrivateMessage = await Bastion.functions.encodeString(args);
    await Bastion.db.run('UPDATE guildSettings SET greetPrivateMessage=(?) WHERE guildID=(?)', [ greetPrivateMessage, message.guild.id ]).catch(e => {
      Bastion.log.error(e);
    });

    message.channel.send({
      embed: {
        color: Bastion.colors.green,
        title: 'Greeting Private Message Set',
        description: args
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
