/**
 * @file greetDM command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const string = require('../../handlers/languageHandler');

exports.run = async (Bastion, message) => {
  if (!message.member.hasPermission(this.help.userPermission)) {
    /**
     * User has missing permissions.
     * @fires userMissingPermissions
     */
    return Bastion.emit('userMissingPermissions', this.help.userPermission);
  }

  let guildSettings = await Bastion.db.get(`SELECT greetDM FROM guildSettings WHERE guildID=${message.guild.id}`).catch(e => {
    Bastion.log.error(e);
  });

  let color, greetDMStats;
  if (guildSettings.greetDM === 'true') {
    await Bastion.db.run(`UPDATE guildSettings SET greetDM='false' WHERE guildID=${message.guild.id}`).catch(e => {
      Bastion.log.error(e);
    });
    color = Bastion.colors.red;
    greetDMStats = 'Sending Greeting Message as Direct Messages are now disabled.';
  }
  else {
    await Bastion.db.run(`UPDATE guildSettings SET greetDM='true' WHERE guildID=${message.guild.id}`).catch(e => {
      Bastion.log.error(e);
    });
    color = Bastion.colors.green;
    greetDMStats = 'Sending Greeting Message as Direct Messages are now enabled.';
  }

  message.channel.send({
    embed: {
      color: color,
      description: greetDMStats
    }
  }).catch(e => {
    Bastion.log.error(e);
  });
};

exports.config = {
  aliases: [],
  enabled: true
};

exports.help = {
  name: 'greetdm',
  description: string('greetDM', 'commandDescription'),
  botPermission: '',
  userPermission: 'ADMINISTRATOR',
  usage: 'greetDM',
  example: []
};
