/**
 * @file resetModLogs command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.run = async (Bastion, message) => {
  try {
    if (!message.member.hasPermission(this.help.userPermission)) {
      /**
      * User has missing permissions.
      * @fires userMissingPermissions
      */
      return Bastion.emit('userMissingPermissions', this.help.userPermission);
    }

    await Bastion.db.run(`UPDATE guildSettings SET modCaseNo='1' WHERE guildID=${message.guild.id}`);

    message.channel.send({
      embed: {
        color: Bastion.colors.GREEN,
        description: 'Moderation log case numbers has been successfully reset.'
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
  aliases: [],
  enabled: true
};

exports.help = {
  name: 'resetModLogs',
  botPermission: '',
  userPermission: 'ADMINISTRATOR',
  usage: 'resetModLogs',
  example: []
};
