/**
 * @file greetPrivate command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.run = async (Bastion, message) => {
  if (!message.member.hasPermission(this.help.userTextPermission)) {
    /**
     * User has missing permissions.
     * @fires userMissingPermissions
     */
    return Bastion.emit('userMissingPermissions', this.help.userTextPermission);
  }

  try {
    let guildSettings = await Bastion.db.get(`SELECT greetPrivate FROM guildSettings WHERE guildID=${message.guild.id}`);

    let color, greetPrivateStats;
    if (guildSettings.greetPrivate) {
      await Bastion.db.run(`UPDATE guildSettings SET greetPrivate=0 WHERE guildID=${message.guild.id}`);
      color = Bastion.colors.RED;
      greetPrivateStats = 'Sending Greeting Message as Direct Messages are now disabled.';
    }
    else {
      await Bastion.db.run(`UPDATE guildSettings SET greetPrivate=1 WHERE guildID=${message.guild.id}`);
      color = Bastion.colors.GREEN;
      greetPrivateStats = 'Sending Greeting Message as Direct Messages are now enabled.';
    }

    message.channel.send({
      embed: {
        color: color,
        description: greetPrivateStats
      }
    }).catch(e => {
      Bastion.log.error(e);
    });
  }
  catch (e) {
    Bastion.log.error(e);
  }
};

exports.config = {
  aliases: [ 'greetprv' ],
  enabled: true
};

exports.help = {
  name: 'greetPrivate',
  botPermission: '',
  userTextPermission: 'ADMINISTRATOR',
  userVoicePermission: '',
  usage: 'greetPrivate',
  example: []
};
