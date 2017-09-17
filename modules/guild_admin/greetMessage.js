/**
 * @file greetMessage command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.run = async (Bastion, message, args) => {
  if (!message.member.hasPermission(this.help.userPermission)) {
    /**
     * User has missing permissions.
     * @fires userMissingPermissions
     */
    return Bastion.emit('userMissingPermissions', this.help.userPermission);
  }

  if (args.length < 1) {
    let guildSettings = await Bastion.db.get(`SELECT greetMessage FROM guildSettings WHERE guildID=${message.guild.id}`).catch(e => {
      Bastion.log.error(e);
    });

    let greetMessage = `Not set. Set greeting message using \`${this.help.name} <Message>\``;
    if (guildSettings.greetMessage) {
      greetMessage = await Bastion.functions.decodeString(guildSettings.greetMessage);
    }

    message.channel.send({
      embed: {
        color: Bastion.colors.BLUE,
        title: 'Greeting Message',
        description: greetMessage
      }
    }).catch(e => {
      Bastion.log.error(e);
    });
  }
  else {
    args = args.join(' ');

    let greetMessage = await Bastion.functions.encodeString(args);
    await Bastion.db.run('UPDATE guildSettings SET greetMessage=(?) WHERE guildID=(?)', [ greetMessage, message.guild.id ]).catch(e => {
      Bastion.log.error(e);
    });

    message.channel.send({
      embed: {
        color: Bastion.colors.GREEN,
        title: 'Greeting Message Set',
        description: args
      }
    }).catch(e => {
      Bastion.log.error(e);
    });
  }
};

exports.config = {
  aliases: [ 'gmsg' ],
  enabled: true
};

exports.help = {
  name: 'greetMessage',
  botPermission: '',
  userPermission: 'ADMINISTRATOR',
  usage: 'greetMessage [Message]',
  example: [ 'greetMessage Hello $user! Welcome to $server.' ]
};
