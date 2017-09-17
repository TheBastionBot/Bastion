/**
 * @file updateDatabase command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.run = (Bastion, message) => {
  if (!Bastion.credentials.ownerId.includes(message.author.id)) {
    /**
     * User has missing permissions.
     * @fires userMissingPermissions
     */
    return Bastion.emit('userMissingPermissions', this.help.userPermission);
  }

  let step = 0;
  Bastion.db.get('SELECT starboard FROM guildSettings').catch(async () => {
    try {
      await Bastion.db.run('ALTER TABLE guildSettings ADD starboard TEXT');

      message.channel.send({
        embed: {
          color: Bastion.colors.GREEN,
          description: `Part ${++step} complete.`
        }
      }).catch(e => {
        Bastion.log.error(e);
      });
    }
    catch (e) {
      Bastion.log.error(e);
    }
  });
};

exports.config = {
  aliases: [ 'updatedb' ],
  enabled: true
};

exports.help = {
  name: 'updateDatabase',
  botPermission: '',
  userPermission: 'BOT_OWNER',
  usage: 'updateDatabase',
  example: []
};
