/**
 * @file deleteAllTriggers command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const string = require('../../handlers/languageHandler');

exports.run = async (Bastion, message) => {
  if (!Bastion.credentials.ownerId.includes(message.author.id)) {
    /**
     * User has missing permissions.
     * @fires userMissingPermissions
     */
    return Bastion.emit('userMissingPermissions', this.help.userPermission);
  }

  try {
    await Bastion.db.all('DELETE FROM triggers');

    message.channel.send({
      embed: {
        color: Bastion.colors.RED,
        description: 'Deleted all the triggers and responses.'
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
  aliases: [ 'delalltriggers', 'deletealltrips', 'delalltrips' ],
  enabled: true
};

exports.help = {
  name: 'deletealltriggers',
  description: string('deleteAllTriggers', 'commandDescription'),
  botPermission: '',
  userPermission: 'BOT_OWNER',
  usage: 'deleteAllTriggers',
  example: []
};
