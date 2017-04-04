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
sql.open('./data/Bastion.sqlite')

exports.run = (Bastion, message, args) => {
  if (Bastion.credentials.ownerId.indexOf(message.author.id) < 0) return Bastion.log.info('You don\'t have permissions to use this command.');
  if (args.length < 1) return;

  let user = [];
  args.forEach(uid => {
    if (/^[0-9]{18}$/.test(uid)) user.push(uid);
  });
  user = user.concat(message.mentions.users.map(u => u.id));

  sql.run("CREATE TABLE IF NOT EXISTS blacklistedUsers (userID TEXT NOT NULL UNIQUE, PRIMARY KEY(userID))").then(() => {
    sql.all('SELECT userID from blacklistedUsers').then(blUsers => {
      blUsers = blUsers.map(u => u.userID)
      if (/^(add|\+)$/i.test(args[0])) {
        for (let i = 0; i < user.length; i++) {
          if (blUsers.indexOf(user[i]) >= 0) continue;
          sql.run('INSERT OR IGNORE INTO blacklistedUsers (userID) VALUES (?)', [user[i]]).catch(e => {
            Bastion.log.error(e.stack);
          });
        }
        title = 'Added to blacklisted users';
      }
      else if (/^(remove|rem|-)$/i.test(args[0])) {
        for (let i = 0; i < user.length; i++) {
          if (blUsers.indexOf(user[i]) < 0) continue;
          sql.run(`DELETE FROM blacklistedUsers where userID=${user[i]}`).catch(e => {
            Bastion.log.error(e.stack);
          });
        }
        title = 'Removed from blacklisted users';
      } else return;

      message.channel.sendMessage('', {embed: {
        color: 13380644,
        title: title,
        description: user.join(', ')
      }}).catch(e => {
        Bastion.log.error(e.stack);
      });
    }).catch(e => {
      Bastion.log.error(e.stack);
    });
  }).catch(e => {
    Bastion.log.error(e.stack);
  });
};

exports.config = {
  aliases: ['ubl']
};

exports.help = {
  name: 'userblacklist',
  description: 'Adds/Removes user, by mention or user ID, to BOT blacklist, they can\'t use any of the bot\'s commands.',
  permission: '',
  usage: 'userblacklist <+|-|add|rem> <@user-mention|user_id>',
  example: ['userblacklist add @user#001 224433119988776655', 'userblacklist rem 224433119988776655 @user#0001', 'userblacklist + @user#001 224433119988776655', 'userblacklist - 224433119988776655 @user#0001']
};
