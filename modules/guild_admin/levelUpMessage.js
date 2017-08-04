/**
 * @file levelUpMessage command
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

  let guildSettings = await Bastion.db.get(`SELECT levelUpMessage FROM guildSettings WHERE guildID=${message.guild.id}`).catch(e => {
    Bastion.log.error(e);
  });

  let color, levelUpMessageStats;
  if (guildSettings.levelUpMessage === 'true') {
    await Bastion.db.run(`UPDATE guildSettings SET levelUpMessage='false' WHERE guildID=${message.guild.id}`).catch(e => {
      Bastion.log.error(e);
    });
    color = Bastion.colors.red;
    levelUpMessageStats = 'I won\'t any send messages when someone levels up from now on.';
  }
  else {
    await Bastion.db.run(`UPDATE guildSettings SET levelUpMessage='true' WHERE guildID=${message.guild.id}`).catch(e => {
      Bastion.log.error(e);
    });
    color = Bastion.colors.green;
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
};

exports.config = {
  aliases: [ 'lvlupmsg' ],
  enabled: true
};

exports.help = {
  name: 'levelupmessage',
  description: string('levelUpMessage', 'commandDescription'),
  botPermission: '',
  userPermission: 'ADMINISTRATOR',
  usage: 'levelUpMessage',
  example: []
};
