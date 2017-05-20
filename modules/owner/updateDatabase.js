/*
 * Copyright (C) 2017 Sankarsan Kampa
 *                    https://sankarsankampa.com/contact
 *
 * This file is a part of Bastion Discord BOT.
 *                        https://github.com/snkrsnkampa/Bastion
 *
 * This code is licensed under the SNKRSN Shared License. It is free to
 * download, copy, compile, use, study and refer under the terms of the
 * SNKRSN Shared License. You can modify the code only for personal or
 * internal use only. However, you can not redistribute the code without
 * explicitly getting permission fot it.
 *
 * Bastion BOT is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY. See the SNKRSN Shared License for
 * more details.
 *
 * You should have received a copy of the SNKRSN Shared License along
 * with this program. If not, see <https://github.com/snkrsnkampa/Bastion/LICENSE>.
 */

const sql = require('sqlite');
sql.open('./data/Bastion.sqlite');

exports.run = (Bastion, message) => {
  if (!Bastion.credentials.ownerId.includes(message.author.id)) return Bastion.log.info('User doesn\'t have permission to use this command.');

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
  aliases: ['updatedb'],
  enabled: true
};

exports.help = {
  name: 'updatedatabase',
  description: 'Updates Bastion\'s Database to the current release.',
  botPermission: '',
  userPermission: 'Bot Owner',
  usage: 'updateDatabase',
  example: []
};
