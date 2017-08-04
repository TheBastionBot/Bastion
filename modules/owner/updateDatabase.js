/**
 * @file updateDatabase command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const string = require('../../handlers/languageHandler');

exports.run = (Bastion, message) => {
  if (!Bastion.credentials.ownerId.includes(message.author.id)) {
    /**
     * User has missing permissions.
     * @fires userMissingPermissions
     */
    return Bastion.emit('userMissingPermissions', this.help.userPermission);
  }

  let step = 0;
  Bastion.db.get('SELECT whitelistDomains FROM guildSettings').catch(async () => {
    try {
      await Bastion.db.run('ALTER TABLE guildSettings ADD whitelistDomains TEXT NOT NULL DEFAULT \'[]\'');

      message.channel.send({
        embed: {
          color: Bastion.colors.green,
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
  name: 'updatedatabase',
  description: string('updateDatabase', 'commandDescription'),
  botPermission: '',
  userPermission: 'BOT_OWNER',
  usage: 'updateDatabase',
  example: []
};
