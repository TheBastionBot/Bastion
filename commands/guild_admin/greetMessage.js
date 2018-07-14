/**
 * @file greetMessage command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

exports.exec = async (Bastion, message, args) => {
  try {
    if (args.length < 1) {
      let guildModel = await Bastion.database.models.guild.findOne({
        attributes: [ 'greetMessage' ],
        where: {
          guildID: message.guild.id
        }
      });

      let greetMessage = `Not set. Set greeting message using \`${this.help.name} <Message>\``;
      if (guildModel.dataValues.greetMessage) {
        greetMessage = await Bastion.methods.decodeString(guildModel.dataValues.greetMessage);
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

      let greetMessage = await Bastion.methods.encodeString(args);
      await Bastion.database.models.guild.update({
        greetMessage: greetMessage
      },
      {
        where: {
          guildID: message.guild.id
        },
        fields: [ 'greetMessage' ]
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
  description: 'Edits the greeting message that shows when a member joins the server.',
  botPermission: '',
  userTextPermission: 'MANAGE_GUILD',
  userVoicePermission: '',
  usage: 'greetMessage [Message]',
  example: [ 'greetMessage Hello $user! Welcome to $server.' ]
};
