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

exports.run = (Bastion, message, args) => {
  if (args.length < 1) return;
  if (!parseInt(args[0])) return;

  if (!((user = message.mentions.users.first()) && (user = user.id))) {
    if (/^[0-9]{18}$/.test(args[1])) user = args[1];
    else return message.channel.sendMessage('', {embed: {
      color: 13380644,
      description: 'You need to mention the user or give their ID to whom you want to give Bastion Currencies.'
    }}).catch(e => {
      Bastion.log.error(e.stack);
    });
  }
  if (Bastion.credentials.ownerId.indexOf(message.author.id) > -1) {
    sql.get(`SELECT bastionCurrencies FROM profiles WHERE userID=${user}`).then(receiver => {
      if (!receiver)
        sql.run('INSERT INTO profiles (userID, bastionCurrencies) VALUES (?, ?)', [user, parseInt(args[0])]).catch(e => {
          Bastion.log.error(e.stack);
        });
      else
        sql.run(`UPDATE profiles SET bastionCurrencies=${parseInt(receiver.bastionCurrencies)+parseInt(args[0])} WHERE userID=${user}`).catch(e => {
          Bastion.log.error(e.stack);
        });
    }).then(() => {
      message.channel.sendMessage('', {embed: {
        color: 5088314,
        description: `You have given <@${user}> **${args[0]}** Bastion Currencies.`
      }}).catch(e => {
        Bastion.log.error(e.stack);
      });
      Bastion.users.get(user).sendMessage('', {embed: {
        color: 5088314,
        description: `You have been awarded **${args[0]}** Bastion Currencies from ${message.author}.`
      }}).catch(e => {
        Bastion.log.error(e.stack);
      });
    }).catch(e => {
      Bastion.log.error(e.stack);
    });
  }
  else {
    if (message.author.id == user) return;
    sql.get(`SELECT bastionCurrencies FROM profiles WHERE userID=${message.author.id}`).then(sender => {
      if (sender.bastionCurrencies < args[0]) return message.channel.sendMessage('', {embed: {
        color: 13380644,
        description: `Sorry, unfortunately, you don't have enough Bastion Currencies with you to give it to others.\nYou currently have **${sender.bastionCurrencies}** Bastion Currencies.`
      }}).catch(e => {
        Bastion.log.error(e.stack);
      });
      sql.get(`SELECT bastionCurrencies FROM profiles WHERE userID=${user}`).then(receiver => {
        if (!receiver)
          sql.run('INSERT INTO profiles (userID, bastionCurrencies) VALUES (?, ?)', [user, parseInt(args[0])]).catch(e => {
            Bastion.log.error(e.stack);
          });
        else
          sql.run(`UPDATE profiles SET bastionCurrencies=${parseInt(receiver.bastionCurrencies)+parseInt(args[0])} WHERE userID=${user}`).catch(e => {
            Bastion.log.error(e.stack);
          });
      }).catch(e => {
        Bastion.log.error(e.stack);
      });
      sql.run(`UPDATE profiles SET bastionCurrencies=${parseInt(sender.bastionCurrencies)-parseInt(args[0])} WHERE userID=${message.author.id}`).then(() => {
        message.channel.sendMessage('', {embed: {
          color: 5088314,
          description: `You have given <@${user}> **${args[0]}** Bastion Currencies.`
        }}).catch(e => {
          Bastion.log.error(e.stack);
        });
        Bastion.users.get(user).sendMessage('', {embed: {
          color: 5088314,
          description: `You have received **${args[0]}** Bastion Currencies from ${message.author}.`
        }}).catch(e => {
          Bastion.log.error(e.stack);
        });
      }).catch(e => {
        Bastion.log.error(e.stack);
      });
    }).catch(e => {
      Bastion.log.error(e.stack);
    });
  }
};

exports.config = {
  aliases: []
};

exports.help = {
  name: 'give',
  description: 'Give any specified user (by mention or ID) Bastion Currencies deducting that amout from your currencies. If you are the BOT owner, you can give anyone any amount of Bastion Currencies.',
  permission: '',
  usage: 'give [amount] <@user-mention|user_id>',
  example: ['give 100 @user#0001', 'give 150 2233445566778899']
};
