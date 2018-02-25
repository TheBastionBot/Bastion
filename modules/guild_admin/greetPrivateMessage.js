/**
 * @file greetPrivateMessage command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.exec = async (Bastion, message, args) => {
  try {
    if (args.length < 1) {
      let guildSettings = await Bastion.db.get(`SELECT greetPrivateMessage FROM guildSettings WHERE guildID=${message.guild.id}`);

      let greetPrivateMessage = `Not set. Set greeting private message using \`${this.help.name} <Message>\``;
      if (guildSettings.greetPrivateMessage) {
        greetPrivateMessage = await Bastion.functions.decodeString(guildSettings.greetPrivateMessage);
      }

      message.channel.send({
        embed: {
          color: Bastion.colors.BLUE,
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
      await Bastion.db.run('UPDATE guildSettings SET greetPrivateMessage=(?) WHERE guildID=(?)', [ greetPrivateMessage, message.guild.id ]);

      message.channel.send({
        embed: {
          color: Bastion.colors.GREEN,
          title: 'Greeting Private Message Set',
          description: args
        }
      }).catch(e => {
        Bastion.log.error(e);
      });
    }
  }
  catch (e) {
    Bastion.log.error(e);
  }
};

exports.config = {
  aliases: [ 'greetprvmsg' ],
  enabled: true
};

exports.help = {
  name: 'greetPrivateMessage',
  botPermission: '',
  userTextPermission: 'MANAGE_GUILD',
  userVoicePermission: '',
  usage: 'greetPrivateMessage [Message]',
  example: [ 'greetPrivateMessage Hello $user! Welcome to $server.' ]
};
