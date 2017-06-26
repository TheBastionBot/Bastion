/**
 * @file setStatus command
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

  if (args.length >= 1 && (args === 'online' || args === 'idle' || args === 'dnd' || args === 'invisible') ) {
    Bastion.user.setStatus(args.join(' ')).then(() => {
      message.channel.send({
        embed: {
          color: Bastion.colors.green,
          description: `${Bastion.user.username}'s status is now set to **${args.join(' ')}**`
        }
      }).catch(e => {
        Bastion.log.error(e.stack);
      });
    }).catch(e => {
      Bastion.log.error(e.stack);
    });
  }
  else {
    Bastion.user.setStatus(Bastion.config.status).then(() => {
      message.channel.send({
        embed: {
          color: Bastion.colors.green,
          description: `${Bastion.user.username}'s status is now set to the default status **${Bastion.config.status}**`
        }
      }).catch(e => {
        Bastion.log.error(e.stack);
      });
    }).catch(e => {
      Bastion.log.error(e.stack);
    });
  }
};

exports.config = {
  aliases: [],
  enabled: true
};

exports.help = {
  name: 'setstatus',
  description: string('setStatus', 'commandDescription'),
  botPermission: '',
  userPermission: 'BOT_OWNER',
  usage: 'setStatus [online|idle|dnd|invisible]',
  example: [ 'setStatus invisible', 'setStatus' ]
};
