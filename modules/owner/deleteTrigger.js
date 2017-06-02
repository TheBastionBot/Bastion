/**
 * @file deleteTrigger command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const sql = require('sqlite');
sql.open('./data/Bastion.sqlite');

exports.run = (Bastion, message, args) => {
  if (!Bastion.credentials.ownerId.includes(message.author.id)) {
    /**
     * User has missing permissions.
     * @fires userMissingPermissions
     */
    return Bastion.emit('userMissingPermissions', this.help.userPermission);
  }

  if (!args[0]) {
    /**
     * The command was ran with invalid parameters.
     * @fires commandUsage
     */
    return Bastion.emit('commandUsage', message, this.help);
  }

  sql.all(`DELETE FROM triggers WHERE trigger="${args.join(' ').replace(/"/g, '\'')}"`).then(() => {
    message.channel.send({
      embed: {
        color: Bastion.colors.red,
        title: 'Trigger deleted',
        description: args.join(' ')
      }
    }).catch(e => {
      Bastion.log.error(e.stack);
    });
  }).catch(e => {
    Bastion.log.error(e.stack);
  });
};

exports.config = {
  aliases: [ 'deltrigger', 'deletetrip', 'deltrip' ],
  enabled: true
};

exports.help = {
  name: 'deletetrigger',
  description: 'Deletes a trigger and response specified by it\'s trigger.',
  botPermission: '',
  userPermission: 'BOT_OWNER',
  usage: 'deleteTrigger <trigger>',
  example: [ 'deleteTrigger Hi, there?' ]
};
