/**
 * @file giveaway command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

let activeChannel;

exports.run = async (Bastion, message, args) => {
  if (!Bastion.credentials.ownerId.includes(message.author.id)) {
    /**
     * User has missing permissions.
     * @fires userMissingPermissions
     */
    return Bastion.emit('userMissingPermissions', this.help.userPermission);
  }

  if (!args.amount || isNaN(args.amount)) {
    /**
     * The command was ran with invalid parameters.
     * @fires commandUsage
     */
    return Bastion.emit('commandUsage', message, this.help);
  }

  if (!activeChannel) {
    /**
     * Time in hour(s) the giveaway event should go on.
     * @constant
     * @type {number}
     * @default
     */
    const TIMEOUT = 3;
    let reaction = [ '🎈', '🎊', '🎉', '🎃', '🎁', '🎁' ];

    reaction = reaction[Math.floor(Math.random() * reaction.length)];

    try {
      let giveawayMessage = await message.channel.send({
        embed: {
          color: Bastion.colors.BLUE,
          title: 'GIVEAWAY! 🎉',
          description: `Giveaway event started. React to this message with ${reaction} to get **${args.amount}** Bastion Currencies.`,
          footer: {
            text: `Event stops in ${TIMEOUT} hour. You will get your reward after the event has concluded.`
          }
        }
      });
      let giveawayMessageID = giveawayMessage.id;
      activeChannel = message.channel.id;

      setTimeout(async () => {
        let giveawayMessage = await message.channel.fetchMessage(giveawayMessageID).catch(e => {
          Bastion.log.error(e);
        });

        // reaction = encodeURIComponent(reaction);

        let winners = [];
        if (giveawayMessage.reactions.get(reaction)) {
          winners = giveawayMessage.reactions.get(reaction).users.map(u => u.id);
        }

        let winner = winners[Math.floor(Math.random() * winners.length)];
        winner = Bastion.users.get(winner);
        if (winner) {
          /**
          * User's account is debited with `args.amount` Bastion Currencies
          * @fires userDebit
          */
          Bastion.emit('userDebit', winner, args.amount);

          giveawayMessage.edit('', {
            embed: {
              color: Bastion.colors.BLUE,
              title: 'Giveaway event ended',
              description: `${winner.tag} won the giveaway! And has been awarded with **${args.amount}** Bastion Currencies.\nThank you everyone for participating. Better luck next time.`
            }
          }).catch(e => {
            Bastion.log.error(e);
          });
        }

        activeChannel = null;
      }, TIMEOUT * 60 * 60 * 1000);
    }
    catch (e) {
      Bastion.log.error(e);
    }
  }
  else {
    /**
     * Error condition is encountered.
     * @fires error
     */
    return Bastion.emit('error', Bastion.strings.error(message.guild.language, 'busy'), Bastion.strings.error(message.guild.language, 'isEventInUse', true, 'giveaway'), message.channel);
  }
};

exports.config = {
  aliases: [],
  enabled: true,
  argsDefinitions: [
    { name: 'amount', type: Number, alias: 'a', multiple: true, defaultOption: true }
  ]
};

exports.help = {
  name: 'giveaway',
  botPermission: '',
  userPermission: 'BOT_OWNER',
  usage: 'giveaway <amount>',
  example: [ 'giveaway 10' ]
};
