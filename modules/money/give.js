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
  if (args.length < 2 || (isNaN(args[0] = parseInt(args[0])) || args[0] < 1)) {
    return message.channel.send({embed: {
      color: Bastion.colors.yellow,
      title: 'Usage',
      description: `\`${Bastion.config.prefix}${this.help.usage}\``
    }}).catch(e => {
      Bastion.log.error(e.stack);
    });
  }

  let user = message.mentions.users.first();
  if (!(user && (user = user.id))) {
    if (/^[0-9]{18}$/.test(args[1])) {
      user = args[1];
    }
    else {
      return message.channel.send({embed: {
        color: Bastion.colors.red,
        description: 'You need to mention the user or give their ID to whom you want to give Bastion Currencies.'
      }}).catch(e => {
        Bastion.log.error(e.stack);
      });
    }
  }

  if (Bastion.credentials.ownerId.includes(message.author.id)) {
    sql.get(`SELECT bastionCurrencies FROM profiles WHERE userID=${user}`).then(receiver => {
      if (!receiver) {
        sql.run('INSERT INTO profiles (userID, bastionCurrencies) VALUES (?, ?)', [user, args[0]]).catch(e => {
          Bastion.log.error(e.stack);
        });
      }
      else {
        sql.run(`UPDATE profiles SET bastionCurrencies=${parseInt(receiver.bastionCurrencies) + args[0]} WHERE userID=${user}`).catch(e => {
          Bastion.log.error(e.stack);
        });
      }
    }).then(() => {
      message.channel.send({embed: {
        color: Bastion.colors.green,
        description: `You have given <@${user}> **${args[0]}** Bastion Currencies.`
      }}).catch(e => {
        Bastion.log.error(e.stack);
      });
      Bastion.users.get(user).send({embed: {
        color: Bastion.colors.green,
        description: `You have been awarded **${args[0]}** Bastion Currencies from ${message.author}.`
      }}).catch(e => {
        Bastion.log.error(e.stack);
      });
    }).catch(e => {
      Bastion.log.error(e.stack);
    });
  }
  else {
    if (message.author.id === user) {
      return message.channel.send({embed: {
        color: Bastion.colors.red,
        description: 'You can\'t give yourself Bastion Currencies!'
      }}).catch(e => {
        Bastion.log.error(e.stack);
      });
    }

    sql.get(`SELECT bastionCurrencies FROM profiles WHERE userID=${message.author.id}`).then(sender => {
      if (sender.bastionCurrencies < args[0]) {
        return message.channel.send({embed: {
          color: Bastion.colors.red,
          description: `Sorry, unfortunately, you don't have enough Bastion Currencies with you to give it to others.\nYou currently have **${sender.bastionCurrencies}** Bastion Currencies.`
        }}).catch(e => {
          Bastion.log.error(e.stack);
        });
      }
      if (args[0] >= 0.5 * parseInt(sender.bastionCurrencies)) {
        return message.channel.send({embed: {
          color: Bastion.colors.red,
          description: `Sorry, unfortunately, you can't give more than 50% of your Bastion Currencies.\nYou currently have **${sender.bastionCurrencies}** Bastion Currencies.`
        }}).catch(e => {
          Bastion.log.error(e.stack);
        });
      }
      sql.get(`SELECT bastionCurrencies FROM profiles WHERE userID=${user}`).then(receiver => {
        if (!receiver) {
          sql.run('INSERT INTO profiles (userID, bastionCurrencies) VALUES (?, ?)', [user, args[0]]).catch(e => {
            Bastion.log.error(e.stack);
          });
        }
        else {
          sql.run(`UPDATE profiles SET bastionCurrencies=${parseInt(receiver.bastionCurrencies) + args[0]} WHERE userID=${user}`).catch(e => {
            Bastion.log.error(e.stack);
          });
        }
      }).catch(e => {
        Bastion.log.error(e.stack);
      });
      sql.run(`UPDATE profiles SET bastionCurrencies=${parseInt(sender.bastionCurrencies) - args[0]} WHERE userID=${message.author.id}`).then(() => {
        message.channel.send({embed: {
          color: Bastion.colors.green,
          description: `You have given <@${user}> **${args[0]}** Bastion Currencies.`
        }}).catch(e => {
          Bastion.log.error(e.stack);
        });
        Bastion.users.get(user).send({embed: {
          color: Bastion.colors.green,
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
  aliases: [],
  enabled: true
};

exports.help = {
  name: 'give',
  description: 'Give any specified user (by mention or ID) Bastion Currencies deducting that amout from your currencies. If you are the BOT owner, you can give anyone any amount of Bastion Currencies.',
  botPermission: '',
  userPermission: '',
  usage: 'give <amount> <@user-mention|user_id>',
  example: ['give 100 @user#0001', 'give 150 2233445566778899']
};
