/**
 * @file greetPrivateMessage command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.exec = async (Bastion, message, args) => {
  try {
    if (args.length < 1) {
      let guildModel = await Bastion.database.models.guild.findOne({
        attributes: [ 'greetPrivateMessage' ],
        where: {
          guildID: message.guild.id
        }
      });

      let greetPrivateMessage = `Not set. Set greeting private message using \`${this.help.name} <Message>\``;
      if (guildModel.dataValues.greetPrivateMessage) {
        greetPrivateMessage = await Bastion.functions.decodeString(guildModel.dataValues.greetPrivateMessage);
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
      await Bastion.database.models.guild.update({
        greetPrivateMessage: greetPrivateMessage
      },
      {
        where: {
          guildID: message.guild.id
        },
        fields: [ 'greetPrivateMessage' ]
      });

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
