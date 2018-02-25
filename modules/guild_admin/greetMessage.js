/**
 * @file greetMessage command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.exec = async (Bastion, message, args) => {
  try {
    if (args.length < 1) {
      let guildSettings = await Bastion.db.get(`SELECT greetMessage FROM guildSettings WHERE guildID=${message.guild.id}`);

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
      await Bastion.db.run('UPDATE guildSettings SET greetMessage=(?) WHERE guildID=(?)', [ greetMessage, message.guild.id ]);

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
  }
  catch (e) {
    Bastion.log.error(e);
  }
};

exports.config = {
  aliases: [ 'gmsg' ],
  enabled: true
};

exports.help = {
  name: 'greetMessage',
  botPermission: '',
  userTextPermission: 'MANAGE_GUILD',
  userVoicePermission: '',
  usage: 'greetMessage [Message]',
  example: [ 'greetMessage Hello $user! Welcome to $server.' ]
};
