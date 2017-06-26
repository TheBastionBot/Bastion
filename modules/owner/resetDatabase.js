/**
 * @file resetDatabase command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const string = require('../../handlers/languageHandler');

exports.run = (Bastion, message, args) => {
  if (!Bastion.credentials.ownerId.includes(message.author.id)) {
    /**
     * User has missing permissions.
     * @fires userMissingPermissions
     */
    return Bastion.emit('userMissingPermissions', this.help.userPermission);
  }

  if (!args.profiles) {
    /**
     * The command was ran with invalid parameters.
     * @fires commandUsage
     */
    return Bastion.emit('commandUsage', message, this.help);
  }

  Bastion.db.run('DELETE FROM profiles').then(() => {
    message.channel.send({
      embed: {
        color: Bastion.colors.green,
        description: 'Bastion `profiles` database was successfully reset.'
      }
    }).catch(e => {
      Bastion.log.error(e);
    });
  }).catch(e => {
    Bastion.log.error(e);
  });
};

exports.config = {
  aliases: [ 'resetdb' ],
  enabled: true,
  argsDefinitions: [
    { name: 'profiles', type: Boolean, alias: 'p' }
  ]
};

exports.help = {
  name: 'resetdatabase',
  description: string('resetDatabase', 'commandDescription'),
  botPermission: '',
  userPermission: 'BOT_OWNER',
  usage: 'resetDatabase < --profiles >',
  example: [ 'resetDatabase --profiles' ]
};
