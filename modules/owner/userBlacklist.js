/**
 * @file userBlacklist command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const sql = require('sqlite');
sql.open('./data/Bastion.sqlite');

exports.run = (Bastion, message, args) => {
  if (!Bastion.credentials.ownerId.includes(message.author.id)) return Bastion.log.info('User doesn\'t have permission to use this command.');
  if (args.length < 1) {
    return message.channel.send({
      embed: {
        color: Bastion.colors.yellow,
        title: 'Usage',
        description: `\`${Bastion.config.prefix}${this.help.usage}\``
      }
    }).catch(e => {
      Bastion.log.error(e.stack);
    });
  }

  let user = [];
  args.forEach(uid => {
    if (/^[0-9]{18}$/.test(uid)) user.push(uid);
  });
  user = user.concat(message.mentions.users.map(u => u.id));

  sql.run('CREATE TABLE IF NOT EXISTS blacklistedUsers (userID TEXT NOT NULL UNIQUE, PRIMARY KEY(userID))').then(() => {
    sql.all('SELECT userID from blacklistedUsers').then(blUsers => {
      blUsers = blUsers.map(u => u.userID);
      let title;
      if (/^(add|\+)$/i.test(args[0])) {
        for (let i = 0; i < user.length; i++) {
          if (blUsers.includes(user[i])) continue;
          sql.run('INSERT OR IGNORE INTO blacklistedUsers (userID) VALUES (?)', [ user[i] ]).catch(e => {
            Bastion.log.error(e.stack);
          });
        }
        title = 'Added to blacklisted users';
      }
      else if (/^(remove|rem|-)$/i.test(args[0])) {
        for (let i = 0; i < user.length; i++) {
          if (!blUsers.includes(user[i])) continue;
          sql.run(`DELETE FROM blacklistedUsers where userID=${user[i]}`).catch(e => {
            Bastion.log.error(e.stack);
          });
        }
        title = 'Removed from blacklisted users';
      }
      else {
        return message.channel.send({
          embed: {
            color: Bastion.colors.yellow,
            title: 'Usage',
            description: `\`${Bastion.config.prefix}${this.help.usage}\``
          }
        }).catch(e => {
          Bastion.log.error(e.stack);
        });
      }

      message.channel.send({
        embed: {
          color: Bastion.colors.red,
          title: title,
          description: user.join(', ')
        }
      }).catch(e => {
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
  aliases: [ 'ubl' ],
  enabled: true
};

exports.help = {
  name: 'userblacklist',
  description: 'Adds/Removes user, by mention or user ID, to BOT blacklist, they can\'t use any of the bot\'s commands.',
  botPermission: '',
  userPermission: 'Bot Owner',
  usage: 'userblacklist <+|-|add|rem> <@user-mention|user_id>',
  example: [ 'userblacklist add @user#001 224433119988776655', 'userblacklist rem 224433119988776655 @user#0001', 'userblacklist + @user#001 224433119988776655', 'userblacklist - 224433119988776655 @user#0001' ]
};
