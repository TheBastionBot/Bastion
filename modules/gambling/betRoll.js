/**
 * @file betRoll command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

let recentUsers = [];

exports.exec = async (Bastion, message, args) => {
  try {
    let cooldown = 60;

    if (!recentUsers.includes(message.author.id)) {
      if (!args.money || args.money < 1 || !/^(one|two|three|four|five|six)$/i.test(args.outcome)) {
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
        return Bastion.emit('error', Bastion.strings.error(message.guild.language, 'invalidInput'), Bastion.strings.error(message.guild.language, 'minBet', true, minAmount), message.channel);
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

      let user = await Bastion.db.get(`SELECT bastionCurrencies FROM profiles WHERE userID=${message.author.id}`);
      user.bastionCurrencies = parseInt(user.bastionCurrencies);

      if (args.money > user.bastionCurrencies) {
        /**
        * Error condition is encountered.
        * @fires error
        */
        return Bastion.emit('error', Bastion.strings.error(message.guild.language, 'insufficientBalance'), Bastion.strings.error(message.guild.language, 'insufficientBalance', true, user.bastionCurrencies), message.channel);
      }

      recentUsers.push(message.author.id);

      let result;
      if (outcome.toLowerCase() === args.outcome.toLowerCase()) {
        let prize = args.money < 50 ? args.money + outcomes.length : args.money < 100 ? args.money : args.money * 2;
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

      await message.channel.send({
        embed: {
          color: Bastion.colors.BLUE,
          title: `Rolled :${outcome}:`,
          description: result
        }
      });

      setTimeout(() => {
        recentUsers.splice(recentUsers.indexOf(message.author.id), 1);
      }, cooldown * 1000);
    }
    else {
      /**
      * Error condition is encountered.
      * @fires error
      */
      return Bastion.emit('error', Bastion.strings.error(message.guild.language, 'cooldown'), Bastion.strings.error(message.guild.language, 'gamblingCooldown', true, message.author, cooldown), message.channel);
    }
  }
  catch (e) {
    Bastion.log.error(e);
  }
};

exports.config = {
  aliases: [ 'br' ],
  enabled: true,
  argsDefinitions: [
    { name: 'outcome', type: String, alias: 'o', defaultOption: true },
    { name: 'money', type: Number, alias: 'm' }
  ]
};

exports.help = {
  name: 'betRoll',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'betroll < one/two/three/four/five/six > <-m amount>',
  example: [ 'betroll three -m 100' ]
};
