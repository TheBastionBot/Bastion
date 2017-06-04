/**
 * @file userBlacklist command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.run = (Bastion, message, args) => {
  if (!Bastion.credentials.ownerId.includes(message.author.id)) {
    /**
     * User has missing permissions.
     * @fires userMissingPermissions
     */
    return Bastion.emit('userMissingPermissions', this.help.userPermission);
  }

  if (args.length < 1) {
    /**
     * The command was ran with invalid parameters.
     * @fires commandUsage
     */
    return Bastion.emit('commandUsage', message, this.help);
  }

  let user = [];
  args.forEach(uid => {
    if (/^[0-9]{18}$/.test(uid)) user.push(uid);
  });
  user = user.concat(message.mentions.users.map(u => u.id));

  Bastion.db.run('CREATE TABLE IF NOT EXISTS blacklistedUsers (userID TEXT NOT NULL UNIQUE, PRIMARY KEY(userID))').then(() => {
    Bastion.db.all('SELECT userID from blacklistedUsers').then(blUsers => {
      blUsers = blUsers.map(u => u.userID);
      let title;
      if (/^(add|\+)$/i.test(args[0])) {
        for (let i = 0; i < user.length; i++) {
          if (blUsers.includes(user[i])) continue;
          Bastion.db.run('INSERT OR IGNORE INTO blacklistedUsers (userID) VALUES (?)', [ user[i] ]).catch(e => {
            Bastion.log.error(e.stack);
          });
        }
        title = 'Added to blacklisted users';
      }
      else if (/^(remove|rem|-)$/i.test(args[0])) {
        for (let i = 0; i < user.length; i++) {
          if (!blUsers.includes(user[i])) continue;
          Bastion.db.run(`DELETE FROM blacklistedUsers where userID=${user[i]}`).catch(e => {
            Bastion.log.error(e.stack);
          });
        }
        title = 'Removed from blacklisted users';
      }
      else {
        /**
         * The command was ran with invalid parameters.
         * @fires commandUsage
         */
        return Bastion.emit('commandUsage', message, this.help);
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
  userPermission: 'BOT_OWNER',
  usage: 'userblacklist <+|-|add|rem> <@user-mention|user_id>',
  example: [ 'userblacklist add @user#001 224433119988776655', 'userblacklist rem 224433119988776655 @user#0001', 'userblacklist + @user#001 224433119988776655', 'userblacklist - 224433119988776655 @user#0001' ]
};
