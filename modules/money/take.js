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

exports.run = function(Bastion, message, args) {
  if (Bastion.credentials.ownerId.indexOf(message.author.id) < 0) return Bastion.log.info('You don\'t have permissions to use this command.');
  if (args.length < 1) return;
  if (!parseInt(args[0])) return;

  if (!((user = message.mentions.users.first()) && (user = user.id))) {
    if (/^[0-9]{18}$/.test(args[1])) user = args[1];
    else return message.channel.sendMessage('', {embed: {
      color: 13380644,
      description: 'You need to mention the user or give their ID to whom you want to charge for penalty.'
    }}).catch(e => {
      Bastion.log.error(e.stack);
    });
  }
  let reason;
  if (args[2]) reason = args.slice(2).join(' ');
  else reason = 'No reason given.';
  sql.get(`SELECT bastionCurrencies FROM profiles WHERE userID=${user}`).then(profile => {
    if (profile)
      sql.run(`UPDATE profiles SET bastionCurrencies=${parseInt(profile.bastionCurrencies)-parseInt(args[0])} WHERE userID=${user}`).catch(e => {
        Bastion.log.error(e.stack);
      });
  }).then(() => {
    message.channel.sendMessage('', {embed: {
      color: 13380644,
      description: `Penalty of **${args[0]}** Bastion Currencies has been charged to <@${user}>`,
      fields: [
        {
          name: 'Reason',
          value: reason
        }
      ]
    }}).catch(e => {
      Bastion.log.error(e.stack);
    });
    Bastion.users.get(user).sendMessage('', {embed: {
      color: 13380644,
      description: `You have been charged with a penalty of **${args[0]}** Bastion Currencies.`,
      fields: [
        {
          name: 'Reason',
          value: reason
        }
      ]
    }}).catch(e => {
      Bastion.log.error(e.stack);
    });
  }).catch(e => {
    Bastion.log.error(e.stack);
  });
};

exports.config = {
  aliases: ['fine']
};

exports.help = {
  name: 'take',
  description: 'Give any specified user (by mention or ID) penalty/fine by deducting a certain amount of Bastion Currencies from his profile, with an optional specified reason.',
  permission: '',
  usage: 'take [amount] <@user-mention|user_id> [Reason]',
  example: ['take 100 @user#0001 Misbehaving', 'take 150 2233445566778899']
};
