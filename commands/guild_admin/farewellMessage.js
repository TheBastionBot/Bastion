/**
 * @file farewellMessage command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

exports.exec = async (Bastion, message, args) => {
  try {
    if (args.length < 1) {
      let guildModel = await Bastion.database.models.guild.findOne({
        attributes: [ 'farewellMessage' ],
        where: {
          guildID: message.guild.id
        }
      });

      let farewellMessage = `Not set. Set farewell message using \`${this.help.name} <Message>\``;
      if (guildModel.dataValues.farewellMessage) {
        farewellMessage = await Bastion.methods.decodeString(guildModel.dataValues.farewellMessage);
      }

      message.channel.send({
        embed: {
          color: Bastion.colors.BLUE,
          title: 'Farewell Message',
          description: farewellMessage
        }
      }).catch(e => {
        Bastion.log.error(e);
      });
    }
    else {
      args = args.join(' ');

      let farewellMessage = await Bastion.methods.encodeString(args);
      await Bastion.database.models.guild.update({
        farewellMessage: farewellMessage
      },
      {
        where: {
          guildID: message.guild.id
        },
        fields: [ 'farewellMessage' ]
      });

      message.channel.send({
        embed: {
          color: Bastion.colors.GREEN,
          title: 'Farewell Message Set',
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
  aliases: [ 'fmsg' ],
  enabled: true
};

exports.help = {
  name: 'farewellMessage',
  description: 'Edits the farewell message that shows when a member leaves the server.',
  botPermission: '',
  userTextPermission: 'MANAGE_GUILD',
  userVoicePermission: '',
  usage: 'farewellMessage [Message]',
  example: [ 'farewellMessage Goodbye $username. Hope to see you soon!' ]
};
