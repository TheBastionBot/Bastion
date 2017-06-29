/**
 * @file betFlip command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const string = require('../../handlers/languageHandler');
let recentUsers = [];

exports.run = (Bastion, message, args) => {
  let cooldown = 60;

  if (!recentUsers.includes(message.author.id)) {
    if (!args.money || args.money < 1 || !/^(heads|tails)$/i.test(args.outcome)) {
      /**
       * The command was ran with invalid parameters.
       * @fires commandUsage
       */
      return Bastion.emit('commandUsage', message, this.help);
    }

    args.money = parseInt(args.money);

    let minAmount = 5;
    if (args.money < minAmount) {
      /**
       * Error condition is encountered.
       * @fires error
       */
      return Bastion.emit('error', string('invalidInput', 'errors'), string('minBet', 'errorMessage', minAmount), message.channel);
    }

    let outcomes = [
      'Heads',
      'Tails'
    ];
    let outcome = outcomes[Math.floor(Math.random() * outcomes.length)];
    // let outcome = outcomes.random();

    Bastion.db.get(`SELECT bastionCurrencies FROM profiles WHERE userID=${message.author.id}`).then(profile => {
      if (args.money > profile.bastionCurrencies) {
        /**
         * Error condition is encountered.
         * @fires error
         */
        return Bastion.emit('error', string('insufficientBalance', 'errors'), string('insufficientBalance', 'errorMessage', profile.bastionCurrencies), message.channel);
      }

      recentUsers.push(message.author.id);

      let result;
      if (outcome.toLowerCase() === args.outcome.toLowerCase()) {
        let prize = args.money < 50 ? args.money + outcomes.length : args.money < 100 ? args.money : args.money * 1.5;
        result = `Congratulations! You won the bet.\nYou won **${prize}** Bastion Currencies.`;

        /**
         * User's account is debited with Bastion Currencies
         * @fires userDebit
         */
        Bastion.emit('userDebit', message.author, prize);
      }
      else {
        result = 'Sorry, you lost the bet. Better luck next time.';

        /**
         * User's account is credited with Bastion Currencies
         * @fires userCredit
         */
        Bastion.emit('userCredit', message.author, args.money);
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
        }, cooldown * 1000);
      }).catch(e => {
        Bastion.log.error(e);
      });
    }).catch(e => {
      Bastion.log.error(e);
    });
  }
  else {
    /**
     * Error condition is encountered.
     * @fires error
     */
    return Bastion.emit('error', string('cooldown', 'errors'), string('gamblingCooldown', 'errorMessage', message.author, cooldown), message.channel);
  }
};

exports.config = {
  aliases: [ 'bf' ],
  enabled: true,
  argsDefinitions: [
    { name: 'outcome', type: String, alias: 'o', defaultOption: true },
    { name: 'money', type: Number, alias: 'm' }
  ]
};

exports.help = {
  name: 'betflip',
  description: string('betFlip', 'commandDescription'),
  botPermission: '',
  userPermission: '',
  usage: 'betflip < heads/tails > <-m amount>',
  example: [ 'betflip heads -m 100' ]
};
