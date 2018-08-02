/**
 * @file give command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
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
      return Bastion.emit('error', '', Bastion.i18n.error(message.guild.language, 'giveNoUser'), message.channel);
    }

    args.amount = Math.abs(args.amount);
    if (message.author.id === message.guild.ownerID) {
      Bastion.emit('userDebit', message.guild.members.get(user.id), args.amount);

      /**
        * Send a message in the channel to let the Guild Owner know that the operation was successful.
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
          description: `Your account, in **${message.guild.name}** Server, has been debited with **${args.amount}** Bastion Currencies.`
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
        return Bastion.emit('error', '', Bastion.i18n.error(message.guild.language, 'giveYourself'), message.channel);
      }

      let guildMemberModel = await Bastion.database.models.guildMember.findOne({
        attributes: [ 'bastionCurrencies' ],
        where: {
          userID: message.author.id,
          guildID: message.guild.id
        }
      });
      guildMemberModel.dataValues.bastionCurrencies = parseInt(guildMemberModel.dataValues.bastionCurrencies);

      if (guildMemberModel.dataValues.bastionCurrencies < args.amount) {
        /**
         * Error condition is encountered.
         * @fires error
         */
        return Bastion.emit('error', '', Bastion.i18n.error(message.guild.language, 'insufficientBalance', guildMemberModel.dataValues.bastionCurrencies), message.channel);
      }

      let giveLimit = 0.5;
      if (args.amount >= giveLimit * guildMemberModel.dataValues.bastionCurrencies) {
        /**
         * Error condition is encountered.
         * @fires error
         */
        return Bastion.emit('error', '', Bastion.i18n.error(message.guild.language, 'giveLimit', giveLimit * 100), message.channel);
      }

      Bastion.emit('userDebit', message.guild.members.get(user.id), args.amount);
      Bastion.emit('userCredit', message.member, args.amount);

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
          description: `Your account, in **${message.guild.name}** Server, has been debited with **${args.amount}** Bastion Currencies.`
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
          description: `Your account, in **${message.guild.name}** Server, has been credited with **${args.amount}** Bastion Currencies.`
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
  description: 'Give the specified amount of %currency.name_plural% from your account to the specified user. If you are the bot owner, you can give any amount of %currency.name_plural%.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'give < @USER_MENTION | USER_ID > <-n AMOUNT>',
  example: [ 'give @user#0001 -n 50', 'give 114312165731193137 -n 50' ]
};
