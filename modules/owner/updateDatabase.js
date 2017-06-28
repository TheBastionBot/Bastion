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

  // let step = 0;
  // try {
  //   Bastion.db.get('SELECT <COLUMNS> FROM <TABLE>').catch(() => {
  //     Bastion.db.run('ALTER TABLE <TABLE> ADD <COLUMN> <CONSTRAINTS>').then(() => {
  //       message.channel.send({
  //         embed: {
  //           color: Bastion.colors.green,
  //           description: `Part ${++step} complete.`
  //         }
  //       }).then(msg => {
  //         msg.delete(3000).catch(e => {
  //           Bastion.log.error(e);
  //         });
  //       }).catch(e => {
  //         Bastion.log.error(e);
  //       });
  //     }).catch(e => {
  //       Bastion.log.error(e);
  //     });
  //   });
  // }
  // catch (e) {
  //   Bastion.log.error(e);
  //   /**
  //   * Error condition is encountered.
  //   * @fires error
  //   */
  //   Bastion.emit('error', string('unknown', 'errors'), string('unknown', 'errorMessage'), message.channel);
  // }
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
