/**
 * @file levelUpMessage command
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
    let guildSettings = await Bastion.db.get(`SELECT levelUpMessage FROM guildSettings WHERE guildID=${message.guild.id}`);

    let color, levelUpMessageStats;
    if (guildSettings.levelUpMessage) {
      await Bastion.db.run(`UPDATE guildSettings SET levelUpMessage=0 WHERE guildID=${message.guild.id}`);
      color = Bastion.colors.RED;
      levelUpMessageStats = 'I won\'t any send messages when someone levels up from now on.';
    }
    else {
      await Bastion.db.run(`UPDATE guildSettings SET levelUpMessage=1 WHERE guildID=${message.guild.id}`);
      color = Bastion.colors.GREEN;
      levelUpMessageStats = 'I will now send messages when someone levels up.';
    }

    message.channel.send({
      embed: {
        color: color,
        description: levelUpMessageStats
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
  aliases: [ 'lvlupmsg' ],
  enabled: true
};

exports.help = {
  name: 'levelUpMessage',
  botPermission: '',
  userTextPermission: 'ADMINISTRATOR',
  usage: 'levelUpMessage',
  example: []
};
