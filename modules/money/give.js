/**
 * @file give command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.exec = async (Bastion, message, args) => {
  try {
    if (!args.amount) {
      /**
       * The command was ran with invalid parameters.
       * @fires commandUsage
       */
      return Bastion.emit('commandUsage', message, this.help);
    }

    let user;
    if (message.mentions.users.size) {
      user = message.mentions.users.first();
    }
    else if (args.id) {
      user = await message.guild.fetchMember(args.id);
      if (user) {
        user = user.user;
      }
    }
    if (!user) {
      /**
       * Error condition is encountered.
       * @fires error
       */
      return Bastion.emit('error', Bastion.strings.error(message.guild.language, 'invalidInput'), Bastion.strings.error(message.guild.language, 'giveNoUser', true), message.channel);
    }

    args.amount = Math.abs(args.amount);
    if (Bastion.credentials.ownerId.includes(message.author.id)) {
      Bastion.emit('userDebit', user, args.amount);

      /**
        * Send a message in the channel to let the Bot Owner know that the operation was successful.
        */
      message.channel.send({
        embed: {
          color: Bastion.colors.GREEN,
          description: `You've awarded **${args.amount}** Bastion Currencies to <@${user.id}>.`
        }
      }).catch(e => {
        Bastion.log.error(e);
      });

      /**
        * Let the user know by DM that their account has been debited.
        */
      user.send({
        embed: {
          color: Bastion.colors.GREEN,
          description: `Your account has been debited with **${args.amount}** Bastion Currencies.`
        }
      }).catch(e => {
        Bastion.log.error(e);
      });
    }
    else {
      if (message.author.id === user.id) {
        /**
         * Error condition is encountered.
         * @fires error
         */
        return Bastion.emit('error', Bastion.strings.error(message.guild.language, 'forbidden'), Bastion.strings.error(message.guild.language, 'giveYourself', true), message.channel);
      }

      let sender = await Bastion.db.get(`SELECT bastionCurrencies FROM profiles WHERE userID=${message.author.id}`);
      sender.bastionCurrencies = parseInt(sender.bastionCurrencies);

      if (sender.bastionCurrencies < args.amount) {
        /**
         * Error condition is encountered.
         * @fires error
         */
        return Bastion.emit('error', Bastion.strings.error(message.guild.language, 'insufficientBalance'), Bastion.strings.error(message.guild.language, 'insufficientBalance', true, sender.bastionCurrencies), message.channel);
      }

      let giveLimit = 0.5;
      if (args.amount >= giveLimit * sender.bastionCurrencies) {
        /**
         * Error condition is encountered.
         * @fires error
         */
        return Bastion.emit('error', Bastion.strings.error(message.guild.language, 'invalidInput'), Bastion.strings.error(message.guild.language, 'giveLimit', true, giveLimit * 100), message.channel);
      }

      Bastion.emit('userDebit', user, args.amount);
      Bastion.emit('userCredit', message.author, args.amount);

      /**
       * Send a message in the channel to let the user know that the operation was successful.
       */
      message.channel.send({
        embed: {
          color: Bastion.colors.GREEN,
          description: `You have given **${args.amount}** Bastion Currencies to <@${user.id}>.`
        }
      }).catch(e => {
        Bastion.log.error(e);
      });

      /**
       * Let the user receiving Bastion Currencies know by DM that their account has been debited.
       */
      user.send({
        embed: {
          color: Bastion.colors.GREEN,
          description: `Your account has been debited with **${args.amount}** Bastion Currencies.`
        }
      }).catch(e => {
        Bastion.log.error(e);
      });

      /**
       * Let the user sending Bastion Currencies know by DM that their account has been credited.
       */
      message.author.send({
        embed: {
          color: Bastion.colors.RED,
          description: `Your account has been credited with **${args.amount}** Bastion Currencies.`
        }
      }).catch(e => {
        Bastion.log.error(e);
      });
    }
  }
  catch (e) {
    Bastion.log.error(e);
  }
};

exports.config = {
  aliases: [],
  enabled: true,
  argsDefinitions: [
    { name: 'id', type: String, defaultOption: true },
    { name: 'amount', type: Number, alias: 'n' }
  ]
};

exports.help = {
  name: 'give',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'give < @USER_MENTION | USER_ID > <-n AMOUNT>',
  example: [ 'give @user#0001 -n 50', 'give 114312165731193137 -n 50' ]
};
