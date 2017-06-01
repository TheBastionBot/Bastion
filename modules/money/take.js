/**
 * @file take command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const sql = require('sqlite');
sql.open('./data/Bastion.sqlite');

exports.run = (Bastion, message, args) => {
  if (!Bastion.credentials.ownerId.includes(message.author.id)) {
    return Bastion.emit('userMissingPermissions', this.help.userPermission);
  }

  if (args.length < 1 || (isNaN(args[0] = parseInt(args[0])) || args[0] < 1)) {
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

  let user = message.mentions.users.first();
  if (/^[0-9]{18}$/.test(args[1])) {
    user = Bastion.users.get(args[1]);
  }
  if (!user) {
    return message.channel.send({
      embed: {
        color: Bastion.colors.red,
        description: 'You need to mention the user or give their ID to whom you want to charge for penalty.'
      }
    }).catch(e => {
      Bastion.log.error(e.stack);
    });
  }
  let reason;
  if (args[2]) {
    reason = args.slice(2).join(' ');
  }
  else {
    reason = 'No reason given.';
  }

  Bastion.emit('userCredit', user, args[0]);
  /**
   * Send a message in the channel to let the Bot Owner know that the operation was successful.
   */
  message.channel.send({
    embed: {
      color: Bastion.colors.red,
      description: `${args[0]} Bastion Currencies has been taken from <@${user.id}>`,
      fields: [
        {
          name: 'Reason',
          value: reason
        }
      ]
    }
  }).catch(e => {
    Bastion.log.error(e.stack);
  });

  /**
   * Let the user know by DM that their account has been credited.
   */
  user.send({
    embed: {
      color: Bastion.colors.red,
      description: `Your account has been credited with **${args[0]}** Bastion Currencies.`,
      fields: [
        {
          name: 'Reason',
          value: reason
        }
      ]
    }
  }).catch(e => {
    Bastion.log.error(e.stack);
  });
};

exports.config = {
  aliases: [ 'fine' ],
  enabled: true
};

exports.help = {
  name: 'take',
  description: 'Give any specified user (by mention or ID) penalty/fine by deducting a certain amount of Bastion Currencies from his profile, with an optional specified reason.',
  botPermission: '',
  userPermission: 'BOT_OWNER',
  usage: 'take <amount> <@user-mention|user_id> [Reason]',
  example: [ 'take 100 @user#0001 Misbehaving', 'take 150 2233445566778899' ]
};
