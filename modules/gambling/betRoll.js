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
let recentUsers = [];

exports.run = (Bastion, message, args) => {
  if (!recentUsers.includes(message.author.id)) {
    if (!(args[0] = parseInt(args[0])) || !/^(one|two|three|four|five|six)$/i.test(args[1]) || args[0] < 1) {
      return message.channel.send({embed: {
        color: Bastion.colors.yellow,
        title: 'Usage',
        description: `\`${Bastion.config.prefix}${this.help.usage}\``
      }}).catch(e => {
        Bastion.log.error(e.stack);
      });
    }

    if (args[0] < 5) {
      return message.channel.send({embed: {
        color: Bastion.colors.red,
        description: 'Minimum bet amount is 5 Bastion Currencies.'
      }}).catch(e => {
        Bastion.log.error(e.stack);
      });
    }

    let outcomes = [
      'one',
      'two',
      'three',
      'four',
      'five',
      'six'
    ];
    let outcome = outcomes[Math.floor(Math.random() * outcomes.length)];
    // let outcome = outcomes.random();

    sql.get(`SELECT bastionCurrencies FROM profiles WHERE userID=${message.author.id}`).then(profile => {
      if (args[0] > profile.bastionCurrencies) {
        return message.channel.send({embed: {
          color: Bastion.colors.red,
          description: `Unfortunately, you can't bet. You only have **${profile.bastionCurrencies}** Bastion Currencies.`
        }}).catch(e => {
          Bastion.log.error(e.stack);
        });
      }

      recentUsers.push(message.author.id);

      let result;
      if (outcome.toLowerCase() === args[1].toLowerCase()) {
        let prize = args[0] < 50 ? parseInt(args[0]) + outcomes.length : args[0] < 100 ? parseInt(args[0]) : parseInt(args[0]) * 2;
        result = `Congratulations! You won the bet.\nYou won **${prize}** Bastion Currencies.`;
        sql.run(`UPDATE profiles SET bastionCurrencies=${parseInt(profile.bastionCurrencies) + parseInt(prize)} WHERE userID=${message.author.id}`).catch(e => {
          Bastion.log.error(e.stack);
        });
      }
      else {
        result = 'Sorry, you lost the bet. Better luck next time.';
        sql.run(`UPDATE profiles SET bastionCurrencies=${parseInt(profile.bastionCurrencies) - parseInt(args[0])} WHERE userID=${message.author.id}`).catch(e => {
          Bastion.log.error(e.stack);
        });
      }
      message.channel.send({embed: {
        color: Bastion.colors.blue,
        title: `Rolled :${outcome}:`,
        description: result
      }}).then(() => {
        setTimeout(function () {
          recentUsers.splice(recentUsers.indexOf(message.author.id), 1);
        }, 60 * 1000);
      }).catch(e => {
        Bastion.log.error(e.stack);
      });
    }).catch(e => {
      Bastion.log.error(e.stack);
    });
  }
  else {
    message.channel.send({embed: {
      color: Bastion.colors.red,
      description: `${message.author} you have gambled recently for this game, please wait at least 60 seconds before gambling again.`
    }}).catch(e => {
      Bastion.log.error(e.stack);
    });
  }
};

exports.config = {
  aliases: ['br'],
  enabled: true
};

exports.help = {
  name: 'betroll',
  description: 'Bets a specified amount of Bastion currency on prediction of the outcome of rolling a dice. If you win, you win more Bastion Currencies. If you lose, you lose the amount of currency you\'ve bet.',
  botPermission: '',
  userPermission: '',
  usage: 'betroll <amount> <one|two|three|four|five|six>',
  example: ['betroll 100 three']
};
