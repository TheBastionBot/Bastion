/**
 * @file farewellMessage command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.exec = async (Bastion, message, args) => {
  try {
    if (args.length < 1) {
      let guildSettings = await Bastion.db.get(`SELECT farewellMessage FROM guildSettings WHERE guildID=${message.guild.id}`);

      let farewellMessage = `Not set. Set farewell message using \`${this.help.name} <Message>\``;
      if (guildSettings.farewellMessage) {
        farewellMessage = await Bastion.functions.decodeString(guildSettings.farewellMessage);
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

      let farewellMessage = await Bastion.functions.encodeString(args);
      await Bastion.db.run('UPDATE guildSettings SET farewellMessage=(?) WHERE guildID=(?)', [ farewellMessage, message.guild.id ]);

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
  botPermission: '',
  userTextPermission: 'MANAGE_GUILD',
  userVoicePermission: '',
  usage: 'farewellMessage [Message]',
  example: [ 'farewellMessage Goodbye $username. Hope to see you soon!' ]
};
