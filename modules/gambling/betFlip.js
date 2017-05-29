/**
 * @file betFlip command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const sql = require('sqlite');
sql.open('./data/Bastion.sqlite');
let recentUsers = [];

exports.run = (Bastion, message, args) => {
  if (!recentUsers.includes(message.author.id)) {
    if (!(args[0] = parseInt(args[0])) || !/^(heads|tails)$/i.test(args[1]) || args[0] < 1) {
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

    if (args[0] < 5) {
      return message.channel.send({
        embed: {
          color: Bastion.colors.red,
          description: 'Minimum bet amount is 5 Bastion Currencies.'
        }
      }).catch(e => {
        Bastion.log.error(e.stack);
      });
    }

    let outcomes = [
      'Heads',
      'Tails'
    ];
    let outcome = outcomes[Math.floor(Math.random() * outcomes.length)];
    // let outcome = outcomes.random();

    sql.get(`SELECT bastionCurrencies FROM profiles WHERE userID=${message.author.id}`).then(profile => {
      if (args[0] > profile.bastionCurrencies) {
        return message.channel.send({
          embed: {
            color: Bastion.colors.red,
            description: `Unfortunately, you can't bet. You only have **${profile.bastionCurrencies}** Bastion Currencies.`
          }
        }).catch(e => {
          Bastion.log.error(e.stack);
        });
      }

      recentUsers.push(message.author.id);

      let result;
      if (outcome.toLowerCase() === args[1].toLowerCase()) {
        let prize = args[0] < 50 ? parseInt(args[0]) + outcomes.length : args[0] < 100 ? parseInt(args[0]) : parseInt(args[0]) * 1.5;
        result = `Congratulations! You won the bet.\nYou won **${prize}** Bastion Currencies.`;
        Bastion.emit('userDebit', message.author, prize);

      }
      else {
        result = 'Sorry, you lost the bet. Better luck next time.';
        Bastion.emit('userCredit', message.author, args[0]);
      }
      message.channel.send({
        embed: {
          color: Bastion.colors.blue,
          title: `Flipped ${outcome}`,
          description: result
        }
      }).then(() => {
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
    message.channel.send({
      embed: {
        color: Bastion.colors.red,
        description: `${message.author} you have gambled recently for this game, please wait at least 60 seconds before gambling again.`
      }
    }).catch(e => {
      Bastion.log.error(e.stack);
    });
  }
};

exports.config = {
  aliases: [ 'bf' ],
  enabled: true
};

exports.help = {
  name: 'betflip',
  description: 'Bets a specified amount of Bastion currency on prediction of the outcome of flipping a coin. If you win, you win more Bastion Currencies. If you lose, you lose the amount of currency you\'ve bet.',
  botPermission: '',
  userPermission: '',
  usage: 'betflip <amount> <heads|tails>',
  example: [ 'betflip 100 heads' ]
};
