/**
 * @file giveaway command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const string = require('../../handlers/languageHandler');
let activeChannel;

exports.run = (Bastion, message, args) => {
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
    const TIMEOUT = 1;
    let giveawayMessageID, reaction = [ '🎈', '🎊', '🎉', '🎃', '🎁', '🎁' ];

    reaction = reaction[Math.floor(Math.random() * reaction.length)];

    message.channel.send({
      embed: {
        color: Bastion.colors.blue,
        title: 'GIVEAWAY! 🎉',
        description: `Giveaway event started. React to this message with ${reaction} to get **${args.amount}** Bastion Currencies.`,
        footer: {
          text: 'Event stops in 1 hour. You will get your reward after the event has concluded.'
        }
      }
    }).then(msg => {
      giveawayMessageID = msg.id;
      activeChannel = message.channel.id;
    }).catch(e => {
      Bastion.log.error(e);
    });

    setTimeout(function () {
      message.channel.fetchMessage(giveawayMessageID).then(msg => {
        msg.edit('', {
          embed: {
            color: Bastion.colors.blue,
            title: 'Giveaway event ended',
            description: `Giveaway event has been ended. Thank you for participating. All the participants are being rewarded with **${args.amount}** Bastion Currencies.`
          }
        }).then(() => {
          activeChannel = null;
        }).catch(e => {
          Bastion.log.error(e);
        });

        reaction = encodeURIComponent(reaction);
        let winners = [];
        if (msg.reactions.get(reaction)) {
          winners = msg.reactions.get(reaction).users.map(u => u.id);
        }
        winners.forEach(user => {
          user = Bastion.users.get(user);
          if (user) {
            /**
             * User's account is debited with `args.amount` Bastion Currencies
             * @fires userDebit
             */
            Bastion.emit('userDebit', user, args.amount);
            user.send({
              embed: {
                color: Bastion.colors.green,
                description: `Your account has been debited with **${args.amount}** Bastion Currencies.`
              }
            }).catch(e => {
              Bastion.log.error(e);
            });
          }
        });
      }).catch(e => {
        Bastion.log.error(e);
      });
    }, TIMEOUT * 60 * 60 * 1000);
  }
  else {
    /**
     * Error condition is encountered.
     * @fires error
     */
    return Bastion.emit('error', string('busy', 'errors'), 'Can\'t start another giveaway event now. Another giveaway event is already active. Wait a for it to end.', message.channel);
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
  description: string('giveaway', 'commandDescription'),
  botPermission: '',
  userPermission: 'BOT_OWNER',
  usage: 'giveaway <amount>',
  example: [ 'giveaway 10' ]
};
