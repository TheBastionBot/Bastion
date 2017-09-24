/**
 * @file farewell command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */
// I don't understand why this is even needed, but some fellows like this.

exports.run = async (Bastion, message) => {
  if (!message.member.hasPermission(this.help.userPermission)) {
    /**
     * User has missing permissions.
     * @fires userMissingPermissions
     */
    return Bastion.emit('userMissingPermissions', this.help.userPermission);
  }

  let guildSettings = await Bastion.db.get(`SELECT farewell FROM guildSettings WHERE guildID=${message.guild.id}`).catch(e => {
    Bastion.log.error(e);
  });

  let color, farewellStats;
  if (guildSettings.farewell === message.channel.id) {
    await Bastion.db.run(`UPDATE guildSettings SET farewell=null WHERE guildID=${message.guild.id}`).catch(e => {
      Bastion.log.error(e);
    });
    color = Bastion.colors.RED;
    farewellStats = 'Farewell Messages are now disabled.';
  }
  else {
    await Bastion.db.run(`UPDATE guildSettings SET farewell=${message.channel.id} WHERE guildID=${message.guild.id}`).catch(e => {
      Bastion.log.error(e);
    });
    color = Bastion.colors.GREEN;
    farewellStats = 'Farewell Messages are now enabled in this channel.';
  }

  message.channel.send({
    embed: {
      color: color,
      description: farewellStats
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
  name: 'farewell',
  botPermission: '',
  userPermission: 'ADMINISTRATOR',
  usage: 'farewell',
  example: []
};
