/**
 * @file give command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.run = (Bastion, message, args) => {
  if (args.length < 2 || (isNaN(args[0] = parseInt(args[0])) || args[0] < 1)) {
    /**
     * The command was ran with invalid parameters.
     * @fires commandUsage
     */
    return Bastion.emit('commandUsage', message, this.help);
  }

  let user = message.mentions.users.first();
  if (parseInt(args[1]) < 9223372036854775807) {
    user = Bastion.users.get(args[1]);
  }
  if (!user) {
    /**
     * Error condition is encountered.
     * @fires error
     */
    return Bastion.emit('error', 'Invalid Data', 'You need to mention the user or give their ID to whom you want to give Bastion Currencies.', message.channel);
  }

  if (Bastion.credentials.ownerId.includes(message.author.id)) {
    Bastion.emit('userDebit', user, args[0]);

    /**
     * Send a message in the channel to let the Bot Owner know that the operation was successful.
     */
    message.channel.send({
      embed: {
        color: Bastion.colors.green,
        description: `You've awarded **${args[0]}** Bastion Currencies to <@${user.id}>.`
      }
    }).catch(e => {
      Bastion.log.error(e.stack);
    });

    /**
     * Let the user know by DM that their account has been debited.
     */
    user.send({
      embed: {
        color: Bastion.colors.green,
        description: `Your account has been debited with **${args[0]}** Bastion Currencies.`
      }
    }).catch(e => {
      Bastion.log.error(e.stack);
    });
  }
  else {
    if (message.author.id === user.id) {
      /**
       * Error condition is encountered.
       * @fires error
       */
      return Bastion.emit('error', 'Invalid Data', 'You can\'t give yourself Bastion Currencies!', message.channel);
    }

    Bastion.db.get(`SELECT bastionCurrencies FROM profiles WHERE userID=${message.author.id}`).then(sender => {
      if (sender.bastionCurrencies < args[0]) {
        /**
         * Error condition is encountered.
         * @fires error
         */
        return Bastion.emit('error', 'Insufficient Balance', `Sorry, unfortunately, you don't have enough Bastion Currencies with you to give it to others.\nYou currently have **${sender.bastionCurrencies}** Bastion Currencies.`, message.channel);
      }

      if (args[0] >= 0.5 * parseInt(sender.bastionCurrencies)) {
        /**
         * Error condition is encountered.
         * @fires error
         */
        return Bastion.emit('error', 'Invalid Data', `Sorry, unfortunately, you can't give more than 50% of your Bastion Currencies.\nYou currently have **${sender.bastionCurrencies}** Bastion Currencies.`, message.channel);
      }

      Bastion.emit('userDebit', user, args[0]);
      Bastion.emit('userCredit', message.author, args[0]);

      /**
       * Send a message in the channel to let the user know that the operation was successful.
       */
      message.channel.send({
        embed: {
          color: Bastion.colors.green,
          description: `You have given **${args[0]}** Bastion Currencies to <@${user.id}>.`
        }
      }).catch(e => {
        Bastion.log.error(e.stack);
      });

      /**
       * Let the user receiving Bastion Currencies know by DM that their account has been debited.
       */
      user.send({
        embed: {
          color: Bastion.colors.green,
          description: `Your account has been debited with **${args[0]}** Bastion Currencies.`
        }
      }).catch(e => {
        Bastion.log.error(e.stack);
      });

      /**
      * Let the user sending Bastion Currencies know by DM that their account has been credited.
      */
      message.author.send({
        embed: {
          color: Bastion.colors.green,
          description: `Your account has been credited with **${args[0]}** Bastion Currencies.`
        }
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
  example: [ 'give 100 @user#0001', 'give 150 2233445566778899' ]
};
