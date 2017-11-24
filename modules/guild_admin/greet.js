/**
 * @file greet command
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

  let guildSettings = await Bastion.db.get(`SELECT greet FROM guildSettings WHERE guildID=${message.guild.id}`).catch(e => {
    Bastion.log.error(e);
  });

  let color, greetStats;
  if (guildSettings.greet === message.channel.id) {
    Bastion.db.run(`UPDATE guildSettings SET greet=null WHERE guildID=${message.guild.id}`).catch(e => {
      Bastion.log.error(e);
    });
    color = Bastion.colors.RED;
    greetStats = 'Greeting Messages are now disabled.';
  }
  else {
    Bastion.db.run(`UPDATE guildSettings SET greet=${message.channel.id} WHERE guildID=${message.guild.id}`).catch(e => {
      Bastion.log.error(e);
    });
    color = Bastion.colors.GREEN;
    greetStats = 'Greeting Messages are now enabled in this channel.';
  }

  message.channel.send({
    embed: {
      color: color,
      description: greetStats
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
  name: 'greet',
  botPermission: '',
  userTextPermission: 'ADMINISTRATOR',
  usage: 'greet',
  example: []
};
