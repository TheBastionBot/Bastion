/**
 * @file farewellMessage command
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
    let guildSettings = await Bastion.db.get(`SELECT farewellMessage FROM guildSettings WHERE guildID=${message.guild.id}`).catch(e => {
      Bastion.log.error(e);
    });

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
    await Bastion.db.run('UPDATE guildSettings SET farewellMessage=(?) WHERE guildID=(?)', [ farewellMessage, message.guild.id ]).catch(e => {
      Bastion.log.error(e);
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
};

exports.config = {
  aliases: [ 'fmsg' ],
  enabled: true
};

exports.help = {
  name: 'farewellmessage',
  description: string('farewellMessage', 'commandDescription'),
  botPermission: '',
  userPermission: 'ADMINISTRATOR',
  usage: 'farewellMessage [Message]',
  example: [ 'farewellMessage Goodbye $username. Hope to see you soon!' ]
};
