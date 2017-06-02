/**
 * @file giveaway command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const sql = require('sqlite');
sql.open('./data/Bastion.sqlite');
let activeChannels = [];
let winners = [];

exports.run = (Bastion, message, args) => {
  if (!Bastion.credentials.ownerId.includes(message.author.id)) {
    return Bastion.emit('userMissingPermissions', this.help.userPermission);
  }

  if (args.length < 1 || (isNaN(args = parseInt(args[0])) || args < 0)) {
    /**
     * The command was ran with invalid parameters.
     * @fires commandUsage
     */
    return Bastion.emit('commandUsage', message, this.help);
  }

  if (!activeChannels.includes(message.channel.id)) {
    let reaction = [ '🎈', '🎊', '🎉', '🎃', '🎁', '🎁' ];
    reaction = reaction[Math.floor(Math.random() * reaction.length)];
    // let reaction = ['🎈', '🎊', '🎉', '🎃', '🎁', '🎁'].random();
    message.channel.send({
      embed: {
        color: Bastion.colors.blue,
        title: 'GIVEAWAY! 🎉',
        description: `Giveaway event started. React to this message with ${reaction} to get **${args}** Bastion Currencies.`,
        footer: {
          text: 'Event stops in 1 hour. You will get your reward after the event has concluded.'
        }
      }
    }).then(msg => {
      activeChannels.push(message.channel.id);
      setTimeout(function () {
        msg.edit('', {
          embed: {
            color: Bastion.colors.blue,
            title: 'Giveaway event ended',
            description: `Giveaway event has been ended. Thank you for participating. All the participants are being rewarded with **${args}** Bastion Currencies.`
          }
        }).then(() => {
          activeChannels.splice(activeChannels.indexOf(message.channel.id), 1);
        }).catch(e => {
          Bastion.log.error(e.stack);
        });
        if (msg.reactions.get(reaction)) {
          winners = msg.reactions.get(reaction).users.map(u => u.id);
        }
        winners.forEach(user => {
          user = Bastion.users.get(user);
          if (user) {
            Bastion.emit('userDebit', user, args);
            user.send({
              embed: {
                color: Bastion.colors.green,
                description: `Your account has been debited with **${args}** Bastion Currencies.`
              }
            }).catch(e => {
              Bastion.log.error(e.stack);
            });
          }
        });
      }, 60 * 60 * 1000);
    }).catch(e => {
      Bastion.log.error(e.stack);
    });
  }
  else {
    message.channel.send({
      embed: {
        color: Bastion.colors.red,
        description: 'Can\'t start another giveaway event now. Another giveaway event is already active in this channel. Wait a for it to end.'
      }
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
  name: 'giveaway',
  description: 'Starts a giveaway, users get the specified amount of Bastion Currencies if they react to the message with the given reaction, within 1 hour.',
  botPermission: '',
  userPermission: 'BOT_OWNER',
  usage: 'giveaway <amount>',
  example: [ 'giveaway 10' ]
};
