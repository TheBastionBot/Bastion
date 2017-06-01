/**
 * @file updateDatabase command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const sql = require('sqlite');
sql.open('./data/Bastion.sqlite');

exports.run = (Bastion, message) => {
  if (!Bastion.credentials.ownerId.includes(message.author.id)) {
    return Bastion.emit('userMissingPermissions', this.help.userPermission);
  }

  // let step = 0;
  // try {
  //   sql.get('SELECT <COLUMNS> FROM <TABLE>').catch(() => {
  //     sql.run('ALTER TABLE <TABLE> ADD <COLUMN> <CONSTRAINTS>').then(() => {
  //       message.channel.send({
  //         embed: {
  //           color: Bastion.colors.green,
  //           description: `Part ${++step} complete.`
  //         }
  //       }).then(msg => {
  //         msg.delete(3000).catch(e => {
  //           Bastion.log.error(e.stack);
  //         });
  //       }).catch(e => {
  //         Bastion.log.error(e.stack);
  //       });
  //     }).catch(e => {
  //       Bastion.log.error(e.stack);
  //     });
  //   });
  // }
  // catch (e) {
  //   Bastion.log.error(e.stack);
  //   return message.channel.send({
  //     embed: {
  //       color: Bastion.colors.red,
  //       description: 'Some error has occured while updating database, please check the console. And report it to Bastion Developers at https://discord.gg/fzx8fkt'
  //     }
  //   }).catch(e => {
  //     Bastion.log.error(e.stack);
  //   });
  // }
};

exports.config = {
  aliases: [ 'updatedb' ],
  enabled: true
};

exports.help = {
  name: 'updatedatabase',
  description: 'Updates Bastion\'s Database to the current release.',
  botPermission: '',
  userPermission: 'BOT_OWNER',
  usage: 'updateDatabase',
  example: []
};
